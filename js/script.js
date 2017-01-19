
var viewModel = function(map){
	var self = this;

	self.locationlist = ko.observableArray([]);
	self.landmarklist = ko.observableArray([]);
	self.filter = ko.observable();
	self.filteredList = ko.observableArray([]);
	self.availableFilters = ko.observableArray(['none', 'art_gallery', 'library', 'gym', 'cafe', 'church', 'gas_station']);
	self.selectedFilter = ko.observable();

	initialLocations.forEach(function(mark){
		var m = new google.maps.Marker({
			position: mark.pos,
			map: map,
			title: mark.title
		});
		m.setAnimation(null);
      			m.addListener('click', function(){
      				self.bounce(this);
      			});
		self.locationlist.push(m);
	});

	self.currentLocation = ko.observable(self.locationlist()[0]);

	this.setMapLocation = function(location){
		var center = new google.maps.LatLng(location.getPosition().lat(), location.getPosition().lng());
		map.panTo(center);
		self.currentLocation(location);
		//self.getLandmarks();
		//self.filter(null);
		self.bounce(location);
		self.infoWindow(location);
	};

	self.onChange = function(){
		if(self.selectedFilter() == 'none'){
			for(var i = 0; i < self.landmarklist().length; i++){
				self.landmarklist()[i].setMap(null);
			}
			self.landmarklist([]);
		}else{
			self.getLandmarks(self.selectedFilter());
		}
	}

	this.filterList = ko.computed(function(){
		var filter = self.filter();
		if(!filter){
			return self.locationlist();
		}else{
			return ko.utils.arrayFilter(self.locationlist(), function(location){
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
	})

	this.noResults = ko.computed(function(){
		if(self.filterList().length === 0){
			return true;
		}else{
			return false;
		}
	});

	this.getLandmarks = function(type){
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
      				self.infoWindow(this);
      			});
      			self.landmarklist.push(marker);
    		}		
  		}
	}

	this.bounce = function(marker){
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
    		marker.setAnimation(null);
		}, 750);
	}

	this.infoWindow = function(marker){
		self.bounce(marker);
		if(infowindow){
			infowindow.close();
		}
		infowindow = new google.maps.InfoWindow({
    		content: marker.title
  		});
  		infowindow.open(map, marker);		
	}

	self.getLandmarks('point_of_interest');
};

function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		 zoom: 15,
		 center: initialLocations[0].pos
	});

	ko.applyBindings(new viewModel(map));
}

