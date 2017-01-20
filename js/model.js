
// my locations
var initialLocations = [
	{
		pos: {
			lat: 51.5114864,
			lng: -0.1181857
		},
		title: "King's College London - Strand Campus",
	},
	{
		pos: {
			lat: 51.513777,
			lng: -0.1272108
		},
		title: "Favourite Restaurant",
	},
	{
		pos: {
			lat: 51.5139315,
			lng: -0.1186259
		},
		title: "Free Haircuts",
	},
	{
		pos: {
			lat: 51.507888,
			lng: -0.1163927
		},
		title: "Nice Walk",
	},
	{
		pos: {
			lat: 51.504418,
			lng: -0.1327437
		},
		title: "Park",
	}
];

// initialise google maps info window
var infowindow = null;

// stores types of locations for filtering by types
var Type = function(name, type){
	this.typeName = name;
	this.typeData = type;

	this.getData = function(){
		return this.typeData;
	}
};

// filckr api
var flickrKey = "e2ef6e98d3def1689b403dfb3945fc8b";
var flickrAPI = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" 
				+ flickrKey 
				+ "&accuracy=16&lat=%lat%&lon=%lon%&per_page=10&radius=0.1&format=json&jsoncallback=?";

// stores flickr photo url
var Photo = function(photo){
	this.photo = photo;
}

// modal button added to info window
var modalButton = '</br><button type="button" class="btn btn-info btn-sm" data-toggle="modal" data-target="#myModal">View images taken here from Flickr</button>';