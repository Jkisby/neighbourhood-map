
// Viewmodel containing methods to interact with view
var ViewModel = function(map){
	var self = this;
	
	// knockout observables 
	self.locationlist = ko.observableArray([]);
	self.landmarklist = ko.observableArray([]);
	self.filter = ko.observable();
	self.filteredList = ko.observableArray([]);
	self.photos = ko.observableArray([]);
	self.availableFilters = ko.observableArray([
		new Type('None', 'none'),
		new Type('Libraries', 'library'),
		new Type('Gyms', 'gym'),
		new Type('Cafes', 'cafe'),
		new Type('Churches', 'church'),
		new Type('Petrol Stations', 'gas_station'),
		new Type('Art galleries', 'art_gallery'),
	]);
	self.selectedFilter = ko.observable();

	// Create markers for initial locations
	initialLocations.forEach(function(mark){
		var m = new google.maps.Marker({
			position: mark.pos,
			map: map,
			title: mark.title,
			icon: 'img/blue_marker.png'
		});
		// add listener to marker for info window
		m.setAnimation(null);
      	m.addListener('click', function(){
      		self.getLocationPhotos(this);
      	});
      	// add marker to ko observableArray
		self.locationlist.push(m);
	});

	// set current location
	self.currentLocation = ko.observable(self.locationlist()[0]);

	// center map around current location and open info window when selection from list
	this.setMapLocation = function(location){
		var center = new google.maps.LatLng(location.getPosition().lat(), location.getPosition().lng());
		map.panTo(center);
		self.currentLocation(location);
		self.getLocationPhotos(location);
	};

	// update landmark list view when select option is changed
	self.onChange = function(){
		// remove landmarks if none selected
		if(self.selectedFilter() == null){
			return null;
		}
		if(self.selectedFilter().getData() == 'none'){
			for(var i = 0; i < self.landmarklist().length; i++){
				self.landmarklist()[i].setMap(null);
			}
			self.landmarklist([]);
		}else{
			self.getLandmarks(self.selectedFilter().getData());
		}
	};

	// filter initial locations based on filter text input
	this.filterList = ko.computed(function(){
		var filter = self.filter();
		if(!filter){
			return self.locationlist();
		}else{
			return ko.utils.arrayFilter(self.locationlist(), function(location){
				var locations = location.getTitle().toLowerCase().startsWith(filter);
				if(!locations){
					location.setVisible(false);
				}else{
					location.setVisible(true);
				}
				return locations;
			});
		}
	});

	// filter landmark list and map markers based on filter text input
	this.filterMap = ko.computed(function(){
		var filter = self.filter();
		if(!filter){
			for(var i = 0; i < Math.max(self.landmarklist().length, self.locationlist().length); i++){
				if(i < self.landmarklist().length){
					self.landmarklist()[i].setMap(map);
				}
				if(i < self.locationlist().length){
					self.locationlist()[i].setMap(map);
				}
			}
			return self.landmarklist();
		}else{
			return ko.utils.arrayFilter(self.landmarklist(), function(location){
				var locations = location.getTitle().toLowerCase().startsWith(filter);
				if(!locations){
					location.setMap(null);
				}else{
					location.setMap(map);
				}
				return locations;
			});
		}
	});

	// Check for results after filtering initial list
	this.noResults = ko.computed(function(){
		if(self.filterList().length === 0){
			return true;
		}else{
			return false;
		}
	});

	// Check for chosen location to highlight list with css binding
	this.isChosen = function(location){
		return self.currentLocation() === location;
	};

	// get landmark markers via google places api by type specified from select dropdown
	this.getLandmarks = function(type){
		// clear landmark array before updating
		for(var i = 0; i < self.landmarklist().length; i++){
			self.landmarklist()[i].setMap(null);
		}
		self.landmarklist([]);
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: map.getCenter(),
			radius: '1500',
			types: [type]
		}, self.callback);
	};

 	// callback function for google places api
	this.callback = function(results, status) {
  		if (status == google.maps.places.PlacesServiceStatus.OK) {
    		for (var i = 0; i < results.length; i++) {
      			var place = results[i];
      			var marker = new google.maps.Marker({
          			map: map,
          			position: place.geometry.location,
          			title: place.name
        		});
        		marker.setAnimation(null);
      			marker.addListener('click', function(){
      				self.getLocationPhotos(this);
      			});
      			self.landmarklist.push(marker);
    		}		
  		}else{
  			alert("Error - Could not connect to google maps");
  		}
	};

	// Initiate bounce animation for markers
	this.bounce = function(marker){
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
    		marker.setAnimation(null);
		}, 1400);
	};

	// Open info window for current marker and close others if open
	this.infoWindow = function(marker){
		// add bounce animation when info window opens
		self.bounce(marker);
		self.currentLocation(marker);
		//self.getLocationPhotos(marker.getPosition().lat(), marker.getPosition().lng());
		if(infowindow){
			infowindow.close();
		}
		infowindow = new google.maps.InfoWindow({
    		content: marker.title + modalButton
  		});
  		infowindow.open(map, marker);		
	};

	this.getLocationPhotos = function(location){
		self.photos([]);
		var api = flickrAPI.replace('%lat%', location.getPosition().lat());
		api = api.replace('%lon%', location.getPosition().lng());
		self.infoWindow(location);
		$.getJSON(api, function(data){
			self.setPhotos(data, location);
		}).fail(function() { alert("error - Cannot connect to Flickr"); });
	};

	this.setPhotos = function(data, location){
		console.log(data);
		if(!data.photos){
			return null;
		}else{
			for(var i = 0; i < data.photos.photo.length; i++){
				var item = data.photos.photo[i];
				self.photos.push("http://farm" + item.farm + ".static.flickr.com/"
								 + item.server +"/"+ item.id + "_" + item.secret + "_m.jpg");
			}
		}
	};

	// Initiate default set of landmarks
	self.getLandmarks('point_of_interest');
};

// Asynchronously load google map from google maps api
function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: initialLocations[0].pos
	});
	ko.applyBindings(new ViewModel(map));
}

// error handling for google map
function googleError() {
	alert("Error connecting to Google maps.");
	ko.applyBindings(new ViewModel());
}