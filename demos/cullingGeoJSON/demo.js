var map = L.map('mapId').setView([38.89318087185462, -77.02813199840536], 15);
var quadtree = L.quadtree();
var drawnLayers = [];
var bDrawMap = false;

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaWJlc29yYSIsImEiOiJjaXpmdTdveDAwMDFpMnFrNzczdjlsZmpvIn0.WEhfwbjI4LPQrP_g2W11Vg', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(map);

L.geoJson(geoJSON, {
	onEachFeature: function(feature, layer)
	{
		quadtree.add(layer);
	}
}).addTo(map);

getVisibleMarkers();
map.on('move', getVisibleMarkers);
map.on('zoomend', getVisibleMarkers);
map.on('resize', getVisibleMarkers);
$('#drawTreeCB').on('change', toggleCB);

function getVisibleMarkers()
{

	var bounds = map.getBounds();
	var colliders = quadtree.getColliders(bounds);
	var data = [];
	for(var i=0, len=colliders.length; i<len; ++i)
	{

		data.push(colliders[i]);

	}

	$('#resultsPanel').html(buildHTML(data));
	$('.moveToBtn').on('click', function() {
		map.panTo([$(this).data('lat'), $(this).data('lon')]);
	});

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

function buildHTML(data)
{

	var anchors = [];
	data.sort(function(a, b) {
		return a.feature.properties.name.localeCompare(b.feature.properties.name);
	});

	for(var i=0, len=data.length; i<len; ++i)
	{

		var current = data[i];
		var feature = current.feature;
		var properties = feature.properties;
		anchors.push('<a class="btn btn-info btn-block moveToBtn" href="#" data-lat="' + 
			feature.geometry.coordinates[1] + '" data-lon="' + feature.geometry.coordinates[0] + '">' + 
			properties.name + '</a>');

	}

	return anchors.join('');

}