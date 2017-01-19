var initialLocations = [
	{
		pos: {
			lat: -25.363,
			lng: 131.044
		},
		title: "title1",
		img: "img/img1.jpg"
	},
	{
		pos: {
			lat: -28.363,
			lng: 131.044
		},
		title: "random",
		img: "img/img1.jpg"
	},
	{
		pos: {
			lat: -23.363,
			lng: 131.044
		},
		title: "london",
		img: "img/img1.jpg"
	},
	{
		pos: {
			lat: -20.363,
			lng: 131.044
		},
		title: "bridge",
		img: "img/img1.jpg"
	},
	{
		pos: {
			lat: -26.363,
			lng: 131.044
		},
		title: "words",
		img: "img/img1.jpg"
	}
];

var landmarks = "https://maps.googleapis.com/maps/api/place/nearbysearch/"
				+ "json?location=%lat%,%lng%&radius=150&key=AIzaSyCdsY4LFODHr3YVRwoK4XClAUBQrMS8h9I"
