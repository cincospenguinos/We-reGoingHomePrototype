/**
 * modelTest.js
 *
 * Tests the model components. Uses QUnit.
 */
import { Surface } from '../src/model/surface.js';
import { DIRECTION } from '../lib/CONST.js';

/*--- Surface tests */
QUnit.test('closestSurfaceTest', (assert) => {
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

	let closestSurface = Surface.closestSurface({x: 0, y: 10}, surface1, surface2);

	assert.equal(closestSurface, surface1, 'Closest surface should be surface1');	
});

QUnit.test('collisionPointEast', (assert) => {
	let originPoint = { x: 0, y: 10 };
	let direction = DIRECTION.EAST;

	let surface1 = new Surface({ 
		type: Surface.OPAQUE,
		position: { x: 100, y: 10 },
		dimensions: { width: 20, height: 20 }
	});

	let surface2 = new Surface({
		type: Surface.REFLECTIVE,
		position: { x: 100, y: 50 },
		dimensions: { width: 20, height: 20 }
	});

	assert.deepEqual(surface1.getCollisionPoint(originPoint, direction), { x: 90, y: 10}, 'Collision point should be on the outside of surface1.')
	assert.notOk(surface2.getCollisionPoint(originPoint, direction), 'No collision point should be available for surface2');
});

QUnit.test('collisionPointNorth', (assert) => {
	let originPoint = { x: 10, y: 200 };
	let direction = DIRECTION.NORTH;

	let surface1 = new Surface({ 
		type: Surface.OPAQUE,
		position: { x: 10, y: 100 },
		dimensions: { width: 20, height: 20 }
	});

	let surface2 = new Surface({
		type: Surface.REFLECTIVE,
		position: { x: 100, y: 100 },
		dimensions: { width: 20, height: 20 }
	});

	assert.deepEqual(surface1.getCollisionPoint(originPoint, direction), { x: 10, y: 110 }, 'Collision point should be on the outside of surface1.')
	assert.notOk(surface2.getCollisionPoint(originPoint, direction), 'No collision point should be available for surface2');
});

QUnit.test('collisionPointSouth', (assert) => {
	let originPoint = { x: 20, y: 10 };
	let direction = DIRECTION.SOUTH;

	let surface1 = new Surface({ 
		type: Surface.OPAQUE,
		position: { x: 20, y: 100 },
		dimensions: { width: 20, height: 20 }
	});

	let surface2 = new Surface({
		type: Surface.REFLECTIVE,
		position: { x: 100, y: 50 },
		dimensions: { width: 20, height: 20 }
	});

	assert.deepEqual(surface1.getCollisionPoint(originPoint, direction), { x: 20, y: 90 }, 'Collision point should be on the outside of surface1.')
	assert.notOk(surface2.getCollisionPoint(originPoint, direction), 'No collision point should be available for surface2');
});

QUnit.test('collisionPointWest', (assert) => {
	let originPoint = { x: 100, y: 10 };
	let direction = DIRECTION.WEST;

	let surface1 = new Surface({ 
		type: Surface.OPAQUE,
		position: { x: 10, y: 10 },
		dimensions: { width: 20, height: 20 }
	});

	let surface2 = new Surface({
		type: Surface.REFLECTIVE,
		position: { x: 10, y: 50 },
		dimensions: { width: 20, height: 20 }
	});

	assert.deepEqual(surface1.getCollisionPoint(originPoint, direction), { x: 20, y: 10}, 'Collision point should be on the outside of surface1.')
	assert.notOk(surface2.getCollisionPoint(originPoint, direction), 'No collision point should be available for surface2');
});

/*--- Laser tests */

/*--- Puzzle tests */

