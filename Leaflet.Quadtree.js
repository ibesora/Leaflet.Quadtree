/*
* Leaflet quadtree implementation
* Copyright (c) 2017, Isaac Besora Vilardaga (http://www.ibesora.me)
* Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and the Beerware (http://en.wikipedia.org/wiki/Beerware) license.
 */

;(function (factory) {
  var L
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['leaflet'], factory)
  } else if (typeof module !== 'undefined') {
    // Node/CommonJS
    L = require('leaflet')
    module.exports = factory(L)
  } else {
    // Browser globals
    if (typeof window.L === 'undefined') {
      throw new Error('Leaflet must be loaded first')
    }
    factory(window.L)
  }
}(function (L) {

	'use strict';

	var quadtree = L.Class.extend({

		options: {

			maxObjectsPerLevel : 10,
			maxLevels : 8,
			
		},

		initialize: function(options, depthLevel) 
		{

			var self = this;
			L.setOptions(self, options);
			self.depth = depthLevel;
			self.elements = [];
			self.nodes = [];
			self.bounds = L.latLngBounds(L.latLng(), L.latLng());

		},

		isLatLngBounds: function(elem)
		{

      // Unfortunately calling getBounds on a L.circle that hasn't been added
      // to the map causes Leaflet to crash. This had been reported back in 2016
      // but it hasn't been fixed https://github.com/Leaflet/Leaflet/issues/4978
      // As a workaround we check if it's not a circle by checking for a radius
      // property
			return ('function' === typeof elem.getBounds) && !elem.options.radius;

		},

		getElementBounds: function(elem)
		{

			var self = this;
			var elemBounds = null;

			if(self.isLatLngBounds(elem)) 
			{

				elemBounds = elem.getBounds();

			}
			else //It's a marker object
			{

				elemBounds = L.latLngBounds(elem.getLatLng(), elem.getLatLng());

			}

			return elemBounds;

		},

		add: function(elem) 
		{
		
			var self = this;
			var elemBounds = self.getElementBounds(elem);

			if(0 == self.depth && 0 == self.elements.length && 0 == self.nodes.length)
			{

				self.bounds = elemBounds;

			}

			if(0 == self.depth && !self.bounds.intersects(elemBounds))
			{

				//Extend the quadtree, recompute its childs and 
				//redistribute its elements
				self.bounds.extend(elemBounds);
				self.updateChildNodesBounds();
				self.updateChildNodesElements();
				return self.add(elem);

			}
			else if(0 != self.nodes.length)
			{

				//Propagate the insert to the child nodes it intersects
				var quadrants = self.getQuadrants(elemBounds);
				for(var i=0, len=quadrants.length; i<len; ++i)
				{

					self.nodes[quadrants[i]].add(elem);

				}
				return self;

			}

			self.elements.push(elem);

			if(self.options.maxObjectsPerLevel < self.elements.length &&
				self.depth < self.options.maxLevels &&
				0 == self.nodes.length)
			{

				//If the node is full, we haven't reached the maximum depth
				//and we don't have child nodes, split
				self.splitNode();
				self.updateChildNodesElements();

			}

			return self;

		},

		updateChildNodesBounds: function() 
		{

			var self = this;
			if(0 != self.nodes.length)
			{

				var nwChild = self.bounds.getNorthWest();
				var seChild = self.bounds.getSouthEast();
				var center = self.bounds.getCenter();

				//Update the top-left quadrant
				self.nodes[0].bounds = L.latLngBounds(L.latLng(center.lat, nwChild.lng), 
					L.latLng(nwChild.lat, center.lng));
				self.nodes[0].updateChildNodesBounds();
				//Update the top-right quadrant
				self.nodes[1].bounds = L.latLngBounds(L.latLng(center.lat, center.lng), 
					L.latLng(nwChild.lat, seChild.lng));
				self.nodes[1].updateChildNodesBounds();
				//Update the bottom-left quadrant
				self.nodes[2].bounds = L.latLngBounds(L.latLng(seChild.lat, nwChild.lng), 
					L.latLng(center.lat, center.lng));
				self.nodes[2].updateChildNodesBounds();
				//Update the bottom-right quadrant
				self.nodes[3].bounds = L.latLngBounds(L.latLng(seChild.lat, center.lng), 
					L.latLng(center.lat, seChild.lng));
				self.nodes[3].updateChildNodesBounds();

			}

			return self;

		},

		updateChildNodesElements: function()
		{

			var self = this;

			if(0 != self.nodes.length)
			{

				//Distribute the parent node elements to the child ones
				//or regroup them to this node
				var elements = self.getColliders(self.bounds);
				if(self.options.maxObjectsPerLevel < elements.length &&
					self.depth < self.options.maxLevels)
				{

					self.splitNode();
					for(var i=0, lenI=elements.length; i<lenI; ++i)
					{

						var elem = elements[i];
						var quadrants = self.getQuadrants(self.getElementBounds(elem));
						for(var j=0, lenJ=quadrants.length; j<lenJ; ++j)
						{

							self.nodes[quadrants[j]].add(elem);

						}

					}

					self.elements = [];

				}
				else
				{

					self.elements = elements;
					self.nodes = [];

				}

			}

			return self;

		},

		splitNode: function()
		{

			var self = this;

			self.nodes = [];
			for(var i=0; i<4; ++i)
			{

				self.nodes[i] = new quadtree(self.options, self.depth+1);

			}

			self.updateChildNodesBounds();

			return self;

		},

		getQuadrants: function(bounds)
		{

			var self = this;
			var indexes = [];

			for(var i=0, len=self.nodes.length; i<len; ++i)
			{

				if(self.nodes[i].bounds.intersects(bounds))
				{

					indexes.push(i);

				}

			}

			return indexes;

		},

		getPossibleColliders: function(bounds)
		{

			var self = this;
			var colliders = [];

			if(self.bounds.isValid())
			{

				var intersects = self.bounds.intersects(bounds);
				var hasChilds = (0 != self.nodes.length);

				if(!intersects)
				{

					//The object doesn't intersect our bounding box

				}
				else 
				{

					//Append our own elements and if we have children, theirs
					colliders = colliders.concat(self.elements);
					for(var i=0, len=self.nodes.length; i<len; ++i)
					{

						colliders = colliders.concat(self.nodes[i].getPossibleColliders(bounds));

					}

				}

			}

			return colliders;

		},

		getColliders: function(bounds)
		{

			var self = this;
			var realColliders = [];

			if(self.bounds.isValid())
			{
				
				var colliders = self.getPossibleColliders(bounds);

				for(var i=0, len=colliders.length; i<len; ++i)
				{

					var elem = colliders[i];
					var collides = self.intersects(elem, bounds);

					if(collides)
					{

						realColliders.push(elem);

					}

				}

			}

			return realColliders;

		},

		intersects: function(elem, bounds)
		{

			var self = this;
			var elemBounds = self.getElementBounds(elem);

			return bounds.intersects(elemBounds);

		},

		clear: function()
		{

			var self = this;
			self.elements = [];

			for(var i=0, len=self.nodes.length; i<len; ++i)
				self.nodes[i].clear();

			self.nodes = [];

		},

		getBounds: function() {

			var self = this;
			return self.bounds;

		},

		getQuadtreeStats: function() {

			var self = this;

			return self._getQuadtreeStatsAux();

		},

		_getQuadtreeStatsAux: function() {

			var self = this;
			var childs = [];

			if(self.nodes.length)
			{

				childs.push(self.nodes[0]._getQuadtreeStatsAux());
				childs.push(self.nodes[1]._getQuadtreeStatsAux());
				childs.push(self.nodes[2]._getQuadtreeStatsAux());
				childs.push(self.nodes[3]._getQuadtreeStatsAux());

			}
			else
			{

				childs.push(self.elements.length);

			}

			return childs;

		},

		draw: function(map)
		{

			var self = this;
			var drawnLayers = [];
			self.drawAux(map, "#ff0000", drawnLayers);

			return drawnLayers;

		},

		drawAux: function(map, color, layers)
		{

			var self = this;
			if(0 != self.nodes.length)
			{

				self.nodes[0].drawAux(map, "#ffff00", layers);
				self.nodes[1].drawAux(map, "#00ff00", layers);
				self.nodes[2].drawAux(map, "#0000ff", layers);
				self.nodes[3].drawAux(map, "#00ffff", layers);

			}
			else
			{

				var layer = L.rectangle(self.bounds, {color: color, weight: 1});
				layers.push(layer);
				layer.addTo(map);

			}
			
		}

	});

	L.quadtree = function (options) {
		return new quadtree(options, 0);
	};

	return L;

}));