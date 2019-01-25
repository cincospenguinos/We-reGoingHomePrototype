/**
 * surfaceTest.js
 */

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
		let direction = Direction.EAST;

		let surface1 = new Surface({ 
			type: Surface.OPAQUE,
			position: { x: 100, y: 10 },
			dimensions: { width: 20, height: 20 }
		});

		let surface2 = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 100, y: 50 },
			dimensions: { width: 20, height: 20 },
			direction: Direction.SOUTH
		});

		assert.deepEqual(surface1.getLaserCollisionPoint(originPoint, direction), { x: 90, y: 10}, 'Collision point should be on the outside of surface1.')
		assert.notOk(surface2.getLaserCollisionPoint(originPoint, direction), 'No collision point should be available for surface2');
	});

	QUnit.test('collisionPointNorth', (assert) => {
		let originPoint = { x: 10, y: 200 };
		let direction = Direction.NORTH;

		let surface1 = new Surface({ 
			type: Surface.OPAQUE,
			position: { x: 10, y: 100 },
			dimensions: { width: 20, height: 20 }
		});

		let surface2 = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 100, y: 100 },
			dimensions: { width: 20, height: 20 },
			direction: Direction.SOUTH
		});

		assert.deepEqual(surface1.getLaserCollisionPoint(originPoint, direction), { x: 10, y: 110 }, 'Collision point should be on the outside of surface1.')
		assert.notOk(surface2.getLaserCollisionPoint(originPoint, direction), 'No collision point should be available for surface2');
	});

	QUnit.test('collisionPointSouth', (assert) => {
		let originPoint = { x: 20, y: 10 };
		let direction = Direction.SOUTH;

		let surface1 = new Surface({ 
			type: Surface.OPAQUE,
			position: { x: 20, y: 100 },
			dimensions: { width: 20, height: 20 }
		});

		let surface2 = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 100, y: 50 },
			dimensions: { width: 20, height: 20 },
			direction: Direction.SOUTH
		});

		assert.deepEqual(surface1.getLaserCollisionPoint(originPoint, direction), { x: 20, y: 90 }, 'Collision point should be on the outside of surface1.')
		assert.notOk(surface2.getLaserCollisionPoint(originPoint, direction), 'No collision point should be available for surface2');
	});

	QUnit.test('collisionPointWest', (assert) => {
		let originPoint = { x: 100, y: 10 };
		let direction = Direction.WEST;

		let surface1 = new Surface({ 
			type: Surface.OPAQUE,
			position: { x: 10, y: 10 },
			dimensions: { width: 20, height: 20 }
		});

		let surface2 = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 10, y: 50 },
			dimensions: { width: 20, height: 20 },
			direction: Direction.SOUTH
		});

		assert.deepEqual(surface1.getLaserCollisionPoint(originPoint, direction), { x: 20, y: 10}, 'Collision point should be on the outside of surface1.')
		assert.notOk(surface2.getLaserCollisionPoint(originPoint, direction), 'No collision point should be available for surface2');
	});

	QUnit.test('reflectiveSurface', (assert) => {
		let surface = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 10, y: 50 },
			dimensions: { width: 20, height: 20 },
			direction: Direction.EAST
		});

		assert.equal(surface.reflectiveDirection(Direction.SOUTH), Direction.EAST, '');
		assert.equal(surface.reflectiveDirection(Direction.WEST), Direction.NORTH, '');
		assert.notOk(surface.reflectiveDirection(Direction.NORTH), 'The mirror should not reflect in this case');

		surface = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 10, y: 50 },
			dimensions: { width: 20, height: 20 },
			direction: Direction.SOUTH
		});

		assert.equal(surface.reflectiveDirection(Direction.WEST), Direction.SOUTH, '');
		assert.equal(surface.reflectiveDirection(Direction.NORTH), Direction.EAST, '');
		assert.notOk(surface.reflectiveDirection(Direction.EAST), 'The mirror should not reflect in this case');

		surface = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 10, y: 50 },
			dimensions: { width: 20, height: 20 },
			direction: Direction.WEST
		});

		assert.equal(surface.reflectiveDirection(Direction.EAST), Direction.SOUTH, '');
		assert.equal(surface.reflectiveDirection(Direction.NORTH), Direction.WEST, '');
		assert.notOk(surface.reflectiveDirection(Direction.SOUTH), 'The mirror should not reflect in this case');

		surface = new Surface({
			type: Surface.REFLECTIVE,
			position: { x: 10, y: 50 },
			dimensions: { width: 20, height: 20 },
			direction: Direction.NORTH
		});

		assert.equal(surface.reflectiveDirection(Direction.EAST), Direction.NORTH, '');
		assert.equal(surface.reflectiveDirection(Direction.SOUTH), Direction.WEST, '');
		assert.notOk(surface.reflectiveDirection(Direction.NORTH), 'The mirror should not reflect in this case');
	});
})