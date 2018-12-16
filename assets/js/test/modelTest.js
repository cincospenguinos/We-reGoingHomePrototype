/**
 * modelTest.js
 *
 * Tests the model components. Uses QUnit.
 */
import { PuzzleItem } from '../src/model/puzzleItem.js';
import { Surface } from '../src/model/surface.js';
import { Laser } from '../src/model/laser.js';
import { Puzzle } from '../src/model/puzzle.js';
import { DIRECTION } from '../lib/CONST.js';

/*--- PuzzleItem tests */
QUnit.test('rotatedDirectionTest', (assert) => {
	assert.equal(PuzzleItem.rotatedDirection(DIRECTION.EAST, 90), DIRECTION.SOUTH);
	assert.equal(PuzzleItem.rotatedDirection(DIRECTION.SOUTH, 90), DIRECTION.WEST);
	assert.equal(PuzzleItem.rotatedDirection(DIRECTION.WEST, 90), DIRECTION.NORTH);
	assert.equal(PuzzleItem.rotatedDirection(DIRECTION.NORTH, 90), DIRECTION.EAST);

	assert.equal(PuzzleItem.rotatedDirection(DIRECTION.EAST, -90), DIRECTION.NORTH);
	assert.equal(PuzzleItem.rotatedDirection(DIRECTION.SOUTH, -90), DIRECTION.EAST);
	assert.equal(PuzzleItem.rotatedDirection(DIRECTION.WEST, -90), DIRECTION.SOUTH);
	assert.equal(PuzzleItem.rotatedDirection(DIRECTION.NORTH, -90), DIRECTION.WEST);
});

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

/*--- Puzzle tests */
QUnit.test('correctLaserPaths', (assert) => {
	let puzzle = new Puzzle(200, 200);

	puzzle.laser = new Laser({
		direction: DIRECTION.EAST,
		position: { x: 10, y: 10 },
		dimensions: { width: 0, height: 0 }
	});

	puzzle.addSurface(new Surface({
		type: Surface.REFLECTIVE,
		reflectiveDirection: DIRECTION.SOUTH,
		position: { x: 100, y: 10 },
		dimensions: { width: 20, height: 20 }
	}));

	puzzle.addSurface(new Surface({
		type: Surface.OPAQUE,
		position: { x: 90, y: 100 },
		dimensions: { width: 20, height: 20 },
		isTarget: true
	}));

	let path = puzzle.getLaserPath();

	assert.equal(path.length, 3, 'Path has the right number of points');
	assert.deepEqual(path[0], { x: 10, y: 10 }, 'First point is correct');
	assert.deepEqual(path[1], { x: 90, y: 10 }, 'Second point is correct');
	assert.deepEqual(path[2], { x: 90, y: 90 }, 'Third point is correct');
});

QUnit.test('incompletePuzzle', (assert) => {
	let puzzle = new Puzzle(200, 200);

	puzzle.laser = new Laser({
		direction: DIRECTION.EAST,
		position: { x: 10, y: 10 },
		dimensions: { width: 0, height: 0 }
	});

	puzzle.addSurface(new Surface({
		type: Surface.REFLECTIVE,
		reflectiveDirection: DIRECTION.SOUTH,
		position: { x: 100, y: 10 },
		dimensions: { width: 20, height: 20 }
	}));

	puzzle.addSurface(new Surface({
		type: Surface.OPAQUE,
		position: { x: 10, y: 100 },
		dimensions: { width: 20, height: 20 },
		isTarget: true
	}));

	puzzle.getLaserPath();
	assert.notOk(puzzle.solved)
});

QUnit.test('completePuzzle', (assert) => {
	let puzzle = new Puzzle(200, 200);

	puzzle.laser = new Laser({
		direction: DIRECTION.EAST,
		position: { x: 10, y: 10 },
		dimensions: { width: 0, height: 0 }
	});

	puzzle.addSurface(new Surface({
		type: Surface.REFLECTIVE,
		reflectiveDirection: DIRECTION.SOUTH,
		position: { x: 100, y: 10 },
		dimensions: { width: 20, height: 20 }
	}));

	puzzle.addSurface(new Surface({
		type: Surface.OPAQUE,
		position: { x: 90, y: 100 },
		dimensions: { width: 20, height: 20 },
		isTarget: true
	}));

	puzzle.getLaserPath();
	assert.ok(puzzle.solved)
});