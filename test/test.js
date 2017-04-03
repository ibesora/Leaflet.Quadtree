var assert = require('assert');
var L = require('leaflet');
L.Quadtree = require('../Leaflet.Quadtree.js');

describe('L.Quadtree', function() 
{

	describe('Initialization', function() 
	{

		it('Constructor without parameters', function() 
		{

			var qt = L.quadtree();
			assert.equal(qt.options.maxLevels, 8);
			assert.equal(qt.options.maxObjectsPerLevel, 10);

		});

		it('Constructor with options', function() 
		{

			var qt = L.quadtree({
				maxLevels: 15,
				maxObjectsPerLevel: 3
			});

			assert.equal(qt.options.maxLevels, 15);
			assert.equal(qt.options.maxObjectsPerLevel, 3);

		});

	});

	describe('Basic', function() 
	{

		it('Stats', function() 
		{

			var qt = L.quadtree();

			assert.equal(JSON.stringify(qt.getQuadtreeStats()), '[0]');

			qt.add(L.marker([0.0, 0.0]));

			assert.equal(JSON.stringify(qt.getQuadtreeStats()), '[1]');

		});

		it('Insertion', function() 
		{

			var qt = L.quadtree();
			qt.add(L.marker([0.0, 0.0]));
			qt.add(L.marker([0.0, 1.0]));
			qt.add(L.marker([1.0, 0.0]));
			qt.add(L.marker([1.0, 1.0]));

			assert.equal(JSON.stringify(qt.getQuadtreeStats()), '[4]');

		});

		it('Bounds', function() 
		{

			var qt = L.quadtree();
			qt.add(L.marker([0.0, 0.0]));
			qt.add(L.marker([0.0, 1.0]));
			qt.add(L.marker([1.0, 0.0]));
			qt.add(L.marker([1.0, 1.0]));

			assert.equal(JSON.stringify(qt.getBounds()), '{"_southWest":{"lat":0,"lng":0},"_northEast":{"lat":1,"lng":1}}');

		});

		it('Bounds expansion', function() 
		{

			var qt = L.quadtree();
			qt.add(L.marker([0.0, 0.0]));
			qt.add(L.marker([0.0, 1.0]));
			qt.add(L.marker([1.0, 0.0]));
			qt.add(L.marker([1.0, 1.0]));
			qt.add(L.marker([2.0, 2.0]));

			assert.equal(JSON.stringify(qt.getBounds()), '{"_southWest":{"lat":0,"lng":0},"_northEast":{"lat":2,"lng":2}}');

		});

		it('Node split', function() 
		{

			var qt = L.quadtree({maxObjectsPerLevel: 4});
			qt.add(L.marker([0.0, 0.0]));
			qt.add(L.marker([0.0, 50.0]));
			qt.add(L.marker([50.0, 0.0]));
			qt.add(L.marker([50.0, 50.0]));

			qt.add(L.marker([12.5, 12.5]));
			qt.add(L.marker([12.5, 37.5]));
			qt.add(L.marker([38.5, 11.5]));
			qt.add(L.marker([43.75, 37.50]));

			qt.add(L.marker([45.75, 5.0]));
			qt.add(L.marker([45.75, 7.5]));
			qt.add(L.marker([45.75, 10.0]));
			assert.equal(JSON.stringify(qt.getQuadtreeStats()), '[[[[2],[2],[0],[1]],[0],[0],[0]],[2],[2],[2]]');

		});

		it('Node merge', function() 
		{

			var qt = L.quadtree({maxObjectsPerLevel: 4});
			qt.add(L.marker([0.0, 0.0]));
			qt.add(L.marker([0.0, 1.0]));
			qt.add(L.marker([1.0, 0.0]));
			qt.add(L.marker([1.0, 1.0]));
			qt.add(L.marker([0.6, 0.55]));
			qt.add(L.marker([0.7, 0.55]));
			qt.add(L.marker([0.7, 0.6]));
			qt.add(L.marker([0.7, 0.65]));

			qt.add(L.marker([0.0, 1.2]));
			assert.equal(JSON.stringify(qt.getQuadtreeStats()), '[[4],[3],[1],[2]]');

		});

	});

	describe('Advanced', function() 
	{

		it('Geometry on more than one node', function() 
		{

			var qt = L.quadtree({maxObjectsPerLevel: 4});
			qt.add(L.marker([0.0, 0.0]));
			qt.add(L.marker([0.0, 50.0]));
			qt.add(L.marker([50.0, 0.0]));
			qt.add(L.marker([50.0, 50.0]));
			qt.add(L.marker([12.5, 12.5]));
			qt.add(L.marker([12.5, 37.5]));
			qt.add(L.marker([38.5, 12.5]));
			qt.add(L.marker([43.75, 37.50]));
			qt.add(L.marker([45.75, 5.0]));
			qt.add(L.marker([45.75, 7.5]));
			qt.add(L.marker([45.75, 10.0]));
			assert.equal(JSON.stringify(qt.getQuadtreeStats()), '[[[[2],[2],[0],[1]],[1],[0],[0]],[2],[2],[2]]');

		});

		it('Node split + node merge', function() 
		{

			var qt = L.quadtree({maxObjectsPerLevel: 4});
			qt.add(L.marker([0.0, 0.0]));
			qt.add(L.marker([0.0, 1.0]));
			qt.add(L.marker([1.0, 0.0]));
			qt.add(L.marker([1.0, 1.0]));
			qt.add(L.marker([0.6, 0.55]));
			qt.add(L.marker([0.7, 0.55]));
			qt.add(L.marker([0.7, 0.6]));
			qt.add(L.marker([0.7, 0.65]));
			qt.add(L.marker([0.7, 0.2]));
			qt.add(L.marker([0.7, 0.3]));
			qt.add(L.marker([0.7, 0.45]));
			qt.add(L.marker([0.0, 1.2]));
			assert.equal(JSON.stringify(qt.getQuadtreeStats()), '[[[1],[0],[2],[[1],[3],[0],[1]]],[3],[1],[2]]');

		});

	});

});