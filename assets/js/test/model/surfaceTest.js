/**
 * surfaceTest.js
 */
import { TestHelper } from '../testHelper.js';
import { PuzzleItem } from '../../src/model/puzzleItem.js';
import { Surface } from '../../src/model/surface.js';

QUnit.module('Surface', () => {
	QUnit.test('closestItemTest', (assert) => {
		let surface1 = new Surface({
			type: Surface.OPAQUE,
			position: { x: 10, y: 10 },
			dimensions: { width: 20, height: 20 }
		});

		let surface2 = new Surface({ 
			type: Surface.OPAQUE,
			position: { x: 50, y: 10 },
			dimensions: { width: 20, height: 20 }
		});

		let closestSurface = PuzzleItem.closestItem({x: 0, y: 10}, surface1, surface2);

		assert.equal(closestSurface, surface1, 'Closest surface should be surface1');	
	});

	QUnit.test('collisionPointEast', (assert) => {
		let originPoint = { x: 0, y: 10 };
		let direction = TestHelper.directions.east;

		let surface1 = new Surface({ 
			type: Surface.OPAQUE,
			position: { x: 100, y: 10 },
			dimensions: { width: 20, height: 20 }
		});

		let surface2 = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 100, y: 50 },
			dimensions: { width: 20, height: 20 },
			direction: TestHelper.directions.south
		});

		assert.deepEqual(surface1.getLaserCollisionPoint(originPoint, direction), { x: 90, y: 10}, 'Collision point should be on the outside of surface1.')
		assert.notOk(surface2.getLaserCollisionPoint(originPoint, direction), 'No collision point should be available for surface2');
	});

	QUnit.test('collisionPointNorth', (assert) => {
		let originPoint = { x: 10, y: 200 };
		let direction = TestHelper.directions.north;

		let surface1 = new Surface({ 
			type: Surface.OPAQUE,
			position: { x: 10, y: 100 },
			dimensions: { width: 20, height: 20 }
		});

		let surface2 = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 100, y: 100 },
			dimensions: { width: 20, height: 20 },
			direction: TestHelper.directions.south
		});

		assert.deepEqual(surface1.getLaserCollisionPoint(originPoint, direction), { x: 10, y: 110 }, 'Collision point should be on the outside of surface1.')
		assert.notOk(surface2.getLaserCollisionPoint(originPoint, direction), 'No collision point should be available for surface2');
	});

	QUnit.test('collisionPointSouth', (assert) => {
		let originPoint = { x: 20, y: 10 };
		let direction = TestHelper.directions.south;

		let surface1 = new Surface({ 
			type: Surface.OPAQUE,
			position: { x: 20, y: 100 },
			dimensions: { width: 20, height: 20 }
		});

		let surface2 = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 100, y: 50 },
			dimensions: { width: 20, height: 20 },
			direction: TestHelper.directions.south
		});

		assert.deepEqual(surface1.getLaserCollisionPoint(originPoint, direction), { x: 20, y: 90 }, 'Collision point should be on the outside of surface1.')
		assert.notOk(surface2.getLaserCollisionPoint(originPoint, direction), 'No collision point should be available for surface2');
	});

	QUnit.test('collisionPointWest', (assert) => {
		let originPoint = { x: 100, y: 10 };
		let direction = TestHelper.directions.west;

		let surface1 = new Surface({ 
			type: Surface.OPAQUE,
			position: { x: 10, y: 10 },
			dimensions: { width: 20, height: 20 }
		});

		let surface2 = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 10, y: 50 },
			dimensions: { width: 20, height: 20 },
			direction: TestHelper.directions.south
		});

		assert.deepEqual(surface1.getLaserCollisionPoint(originPoint, direction), { x: 20, y: 10}, 'Collision point should be on the outside of surface1.')
		assert.notOk(surface2.getLaserCollisionPoint(originPoint, direction), 'No collision point should be available for surface2');
	});

	QUnit.test('reflectiveSurface', (assert) => {
		let surface = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 10, y: 50 },
			dimensions: { width: 20, height: 20 },
			direction: TestHelper.directions.east
		});

		assert.equal(surface.reflectiveDirection(TestHelper.directions.south), TestHelper.directions.east, '');
		assert.equal(surface.reflectiveDirection(TestHelper.directions.west), TestHelper.directions.north, '');
		assert.notOk(surface.reflectiveDirection(TestHelper.directions.north), 'The mirror should not reflect in this case');

		surface = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 10, y: 50 },
			dimensions: { width: 20, height: 20 },
			direction: TestHelper.directions.south
		});

		assert.equal(surface.reflectiveDirection(TestHelper.directions.west), TestHelper.directions.south, '');
		assert.equal(surface.reflectiveDirection(TestHelper.directions.north), TestHelper.directions.east, '');
		assert.notOk(surface.reflectiveDirection(TestHelper.directions.east), 'The surface should not reflect in this case');

		surface = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 10, y: 50 },
			dimensions: { width: 20, height: 20 },
			dimensions: { width: 20, height: 20 },
			direction: TestHelper.directions.west
		});

		assert.equal(surface.reflectiveDirection(TestHelper.directions.east), TestHelper.directions.south, '');
		assert.equal(surface.reflectiveDirection(TestHelper.directions.north), TestHelper.directions.west, '');
		assert.notOk(surface.reflectiveDirection(TestHelper.directions.south), 'The mirror should not reflect in this case');

		surface = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 10, y: 50 },
			dimensions: { width: 20, height: 20 },
			direction: TestHelper.directions.north
		});

		assert.equal(surface.reflectiveDirection(TestHelper.directions.east), TestHelper.directions.north, '');
		assert.equal(surface.reflectiveDirection(TestHelper.directions.south), TestHelper.directions.west, '');
		assert.notOk(surface.reflectiveDirection(TestHelper.directions.north), 'The mirror should not reflect in this case');
	});
})