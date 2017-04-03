var map = L.map('mapId').setView([42.101152, 1.845167], 15);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWJlc29yYSIsImEiOiJjaXpmdTdveDAwMDFpMnFrNzczdjlsZmpvIn0.WEhfwbjI4LPQrP_g2W11Vg', {
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

	console.log(JSON.stringify(quadtree.getQuadtreeStats()));

}

map.on('click', onMapClick);

var marker = L.marker([0.0, 0.0]);
quadtree.add(marker);
marker.addTo(map);
marker = L.marker([0.0, 50.0]);
quadtree.add(marker);
marker.addTo(map);
marker = L.marker([50.0, 0.0]);
quadtree.add(marker);
marker.addTo(map);
marker = L.marker([50.0, 50.0]);
quadtree.add(marker);
marker.addTo(map);
marker = L.marker([12.5, 12.5]);
quadtree.add(marker);
marker.addTo(map);
marker = L.marker([12.50, 37.50]);
quadtree.add(marker);
marker.addTo(map);
marker = L.marker([38.50, 12.50]);
quadtree.add(marker);
marker.addTo(map);
marker = L.marker([43.75, 37.50]);
quadtree.add(marker);
marker.addTo(map);
marker = L.marker([45.75, 5.0]);
quadtree.add(marker);
marker.addTo(map);
marker = L.marker([45.75, 7.5]);
quadtree.add(marker);
marker.addTo(map);
marker = L.marker([45.75, 10.0]);
quadtree.add(marker);
marker.addTo(map);
quadtree.draw(map);
console.log(JSON.stringify(quadtree.getQuadtreeStats()));