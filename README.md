# Leaflet.Quadtree
[![Build Status](https://travis-ci.org/ibesora/Leaflet.Quadtree.svg?branch=master)](https://travis-ci.org/ibesora/Leaflet.Quadtree)
[![Coverage Status](https://coveralls.io/repos/github/ibesora/Leaflet.Quadtree/badge.svg?branch=master)](https://coveralls.io/github/ibesora/Leaflet.Quadtree?branch=master)
[![npm version](https://badge.fury.io/js/leaflet-quadtree.svg)](https://badge.fury.io/js/leaflet-quadtree)
[![dependencies](https://david-dm.org/ibesora/Leaflet.Quadtree.png)](https://david-dm.org/ibesora/Leaflet.Quadtree)

> Leaflet plugin that implements a quadtree for efficient retrieval of visible features' properties

To see the plugin in action just click one of the following links:
* __Visible feature properties retrieval:__ Sample data is loaded into the map and the quadtree is used to efficiently crawl the features of each visible element. You can find the demo [here](https://ibesora.github.io/Leaflet.Quadtree/demos/cullingGeoJSON/demo.html)
* __Marker culling:__ On each click a numbered marker is created, the quadtree is updated and the visible elements' numbers are shown. You can find the demo [here](https://ibesora.github.io/Leaflet.Quadtree/demos/culling/demo.html)
* __Quadtree construction:__ On each click a marker is created and the resulting quadtree is shown. You can find the demo [here](https://ibesora.github.io/Leaflet.Quadtree/demos/drawTree/demo.html)

## Usage

Create a marker or a polygon and add it to the quadtree. It can even be your own class, it only has to implement the [getLatLng()](http://leafletjs.com/reference-1.0.3.html#marker-getlatlng) or the [getBounds()](http://leafletjs.com/reference-1.0.3.html#polygon-getbounds) methods.

```js
// create the quadtree with the options you want
var quadtree = L.quadtree({maxObjectsPerLevel: 4});
...

// add the markers to the quadtree
quadtree.add(marker);
...

//retrieve the visible markers or polygons inside some bounds
//map bounds are used in the examples but any bounds can be used
var bounds = map.getBounds();
var colliders = quadtree.getColliders(bounds);
```

## Documentation
### Constructor
Constructs a quadtree object
```js
var quadtree = L.quadtree(options);
```
####Options
<table>
<thead>
<th>Property</th>
<th>Description</th>
<th>Type</th>
<th>Default</th>
</thead>
<tbody>
<tr>
<td>maxObjectsPerLevel</td>
<td>Maximum number of markers or polygons per level. When the number of objects on a level is greater than the one specified here the node is split into 4 child nodes.</td>
<td>Integer</td>
<td>10</td>
</tr>
<tr>
<td>maxLevels</td>
<td>Maximum number of levels of the quadtree. When the quadtree reaches this depth the leaf nodes are not split anymore</td>
<td>Integer</td>
<td>8</td>
</tr>
</tbody>
</table>
### Add element to the quadtree
Adds an element to the quatree. Any object that implements the [getLatLng()](http://leafletjs.com/reference-1.0.3.html#marker-getlatlng) or the [getBounds()](http://leafletjs.com/reference-1.0.3.html#polygon-getbounds) methods is supported
```js
var quadtree = L.quadtree(options);
...
quadtree.add(marker);
```
### Get colliders
Gets an array with the elements that fall inside the given bounds
```js
var quadtree = L.quadtree(options);
...
var colliders = quadtree.getColliders(bounds);
```
### Get the possible colliders
Gets an array with the elements that might fall inside the given bounds. This method is faster than the previous one although it's inexact, you can use it if you only need an upper bound of the visible elements. __This method returns the elements found on the leaf nodes that intersect the given bounds__
```js
var quadtree = L.quadtree(options);
...
var colliders = quadtree.getPossibleColliders(bounds);
```
### Get quadtree stats
Gets an array with the number of elements inside each node. If a node has childs an array is returned with the elements of its child nodes in the following order [NW, NE, SW, SE]
```js
var quadtree = L.quadtree(options);
...
var stats = quadtree.getQuadtreeStats();
```
## License

Copyright (c) 2017- ibesora (BEERWARE License)  
See [LICENSE](https://ibesora.github.io/Leaflet.Quadtree/LICENSE) for more info.