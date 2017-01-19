
var viewModel = function(map){
	var self = this;
	self.locationlist = ko.observableArray([]);
	self.filter = ko.observable();
	self.filteredList = ko.observableArray([]);

	initialLocations.forEach(function(mark){
		var m = new google.maps.Marker({
			position: mark.pos,
			map: map,
			title: mark.title
		});
		self.locationlist.push(m);
	});

	self.currentLocation = ko.observable(self.locationlist()[0]);

	this.setLocation = function(location){
		self.currentLocation(location);
	};

	this.setMapLocation = function(location){
		console.log(location.getTitle());
		var center = new google.maps.LatLng(location.getPosition().lat(), location.getPosition().lng());
		map.panTo(center);
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
	
};
console.log(landmarks);

function initMap() {
	var map = new google.maps.Map(document.getElementById('map'), {
		 zoom: 7,
		 center: initialLocations[0].pos
	});

	ko.applyBindings(new viewModel(map));
}

