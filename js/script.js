
var viewModel = function(map){
	var self = this;
	self.locationlist = ko.observableArray([]);
	self.landmarklist = ko.observableArray([]);
	self.filter = ko.observable();
	self.filteredList = ko.observableArray([]);

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
		self.getLandmarks();
	};

	this.filterList = ko.computed(function(){
		var filter = self.filter();
		if(!filter){
			return self.locationlist();
		}else{
			return ko.utils.arrayFilter(self.locationlist(), function(location){
				return location.getTitle().toLowerCase().startsWith(filter);
			});
		}
	});

	this.noResults = ko.computed(function(){
		if(self.filterList().length === 0){
			return true;
		}else{
			return false;
		}
	});

	this.getLandmarks = function(){
		console.log(self.landmarklist().length);
		for(var i = 0; i < self.landmarklist().length; i++){
			self.landmarklist()[i].setMap(null);
		}
		self.landmarklist([]);
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: map.getCenter(),
			radius: '500',
			types: ['point_of_interest']
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
      				self.bounce(this);
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

	self.getLandmarks();
};

function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		 zoom: 15,
		 center: initialLocations[0].pos
	});

	ko.applyBindings(new viewModel(map));
}

