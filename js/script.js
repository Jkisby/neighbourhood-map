
var viewModel = function(map){
	var self = this;
	self.locationlist = ko.observableArray([]);

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
	}

	this.setMapLocation = function(location){
		console.log(location.getTitle());
		var center = new google.maps.LatLng(location.getPosition().lat(), location.getPosition().lng());
		map.panTo(center);
	}

}


function initMap() {
	var timeout = setTimeout(function(){
        alert("Failed to get wikipedia resources");
    }, 4000);

	var map = new google.maps.Map(document.getElementById('map'), {
		 zoom: 7,
		 center: initialLocations[0].pos
	});

	ko.applyBindings(new viewModel(map));
}

