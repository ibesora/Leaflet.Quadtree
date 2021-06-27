const markerNumber = 1000000; // The number of pins the quadtree manages
const maxVisiblePins = 1000; // The maximum number of pins visible at once

const map = L.map('mapId').setView([42.101152, 1.845167], 8);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.streets'
}).addTo(map);
const quadtree = L.quadtree();
const drawnMarkers = [];

const addRandomMarkers = () => {
  for(let i=0; i< markerNumber; ++i) {
    const lat = Math.random()*180 - 90;
    const lng = Math.random()*360 - 180;
    const marker = L.circle([lat, lng], 200);
    quadtree.add(marker);
  }
}

const checkVisibleMarkers = (map, quadtree, drawnMarkers) => {
  const bounds = map.getBounds();
  const colliders = quadtree.getColliders(bounds);
  if (colliders.length > maxVisiblePins) {
    $('#markers').html(`Too many markers to render in DOM: ${colliders.length}`);
    for(let i=0; i<drawnMarkers.length; ++i) {
      map.removeLayer(drawnMarkers[i]);
    }

  } else {
    $('#markers').html(`Number of markers in bounds: ${colliders.length}`);
    for(let i=0; i<colliders.length; ++i) {
      colliders[i].addTo(map);
      drawnMarkers.push(colliders[i]);
    }
  }
}

const showMap = () => {
  $('#mapId').css('display', 'block');
  $('#rightPanel').css('display', 'block');
  $('#loading').css('display', 'none');
  map.invalidateSize();
}

setTimeout(() => {
  addRandomMarkers()
  checkVisibleMarkers(map, quadtree, drawnMarkers, maxVisiblePins);
  showMap()
}, 0)

map.on('moveend', () => {
  checkVisibleMarkers(map, quadtree, drawnMarkers, maxVisiblePins);
});