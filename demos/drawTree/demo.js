var map = L.map('mapId').setView([42.101152, 1.845167], 15);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWJlc29yYSIsImEiOiJjajNkYzFjZXAwMDAwMndwY2w4bDUyN2VtIn0.q1VJCpeta1ZYDNNZJcyPbw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(map);

var quadtree = L.quadtree({maxObjectsPerLevel: 4});
var drawnLayers = [];

function onMapClick(e) 
{
	
	var marker = L.marker(e.latlng);
	marker.addTo(map);
	quadtree.add(marker);

	for(var i=0, len=drawnLayers.length; i<len; ++i)
		map.removeLayer(drawnLayers[i]);
	drawnLayers = quadtree.draw(map);
}

map.on('click', onMapClick);