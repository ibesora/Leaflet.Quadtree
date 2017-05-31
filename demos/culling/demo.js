var map = L.map('mapId').setView([42.101152, 1.845167], 15);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWJlc29yYSIsImEiOiJjajNkYzFjZXAwMDAwMndwY2w4bDUyN2VtIn0.q1VJCpeta1ZYDNNZJcyPbw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(map);

var quadtree = L.quadtree();
var drawnLayers = [];
var numMarkers = 0;
var bDrawMap = false;

function onMapClick(e) 
{
	
	var marker = new L.marker(e.latlng, {
		icon:	new L.NumberedDivIcon({
			number: numMarkers
		})
	});
	marker.addTo(map);
	quadtree.add(marker);

	if(bDrawMap)
	{

		for(var i=0, len=drawnLayers.length; i<len; ++i)
			map.removeLayer(drawnLayers[i]);
		drawnLayers = quadtree.draw(map);

	}

	numMarkers++;
	getVisibleMarkers();

}

function getVisibleMarkers()
{

	var bounds = map.getBounds();
	var colliders = quadtree.getColliders(bounds);
	var ids = [];
	for(var i=0, len=colliders.length; i<len; ++i)
	{

		ids.push(getElementId(colliders[i]));

	}

	ids.sort(function(a, b) {
		return Number.parseInt(a) < Number.parseInt(b);
	});

	$('#resultsPanel').html(JSON.stringify(ids));

}

function getElementId(elem)
{

	return elem.options.icon.options.number;

}

function toggleCB()
{

	bDrawMap = $('#drawTreeCB').is(':checked');
	if(bDrawMap)
	{

		drawnLayers = quadtree.draw(map);

	}
	else
	{

		for(var i=0, len=drawnLayers.length; i<len; ++i)
			map.removeLayer(drawnLayers[i]);
		drawnLayers = [];

	}

}

map.on('click', onMapClick);
map.on('move', getVisibleMarkers);
map.on('zoomend', getVisibleMarkers);
map.on('resize', getVisibleMarkers);
$('#drawTreeCB').on('change', toggleCB);
