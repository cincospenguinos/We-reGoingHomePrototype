/**
 * modelTest.js
 *
 * Tests the model components. Uses QUnit.
 */
import { PuzzleItem } from '../src/model/puzzleItem.js';
import { Surface } from '../src/model/surface.js';
import { Laser } from '../src/model/laser.js';
import { Puzzle } from '../src/model/puzzle.js';
import { Direction } from '../src/model/direction.js';
import { Target } from '../src/model/target.js';
import { Exit } from '../src/model/exit.js';

/*--- Direction tests */
QUnit.test('rotatedDirectionTest', (assert) => {
	assert.equal(Direction.directionFromRotation(Direction.EAST, 90), Direction.SOUTH);
	assert.equal(Direction.directionFromRotation(Direction.SOUTH, 90), Direction.WEST);
	assert.equal(Direction.directionFromRotation(Direction.WEST, 90), Direction.NORTH);
	assert.equal(Direction.directionFromRotation(Direction.NORTH, 90), Direction.EAST);

	assert.equal(Direction.directionFromRotation(Direction.EAST, -90), Direction.NORTH);
	assert.equal(Direction.directionFromRotation(Direction.SOUTH, -90), Direction.EAST);
	assert.equal(Direction.directionFromRotation(Direction.WEST, -90), Direction.SOUTH);
	assert.equal(Direction.directionFromRotation(Direction.NORTH, -90), Direction.WEST);
});

/*--- Surface tests */
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

/*--- Puzzle tests */
QUnit.test('correctLaserPaths', (assert) => {
	let puzzle = new Puzzle({
		dimensions: { width: 200, height: 200 },
		key: 'somepuzzle',
		roomKey: 'someroom'
	});

	puzzle.addLaser(new Laser({
		key: 'laserKey',
		direction: Direction.EAST,
		position: { x: 10, y: 10 },
		dimensions: { width: 0, height: 0 },
		laserInteractable: true
	}));

	puzzle.addSurface(new Surface({
		type: Surface.REFLECTIVE,
		direction: Direction.SOUTH,
		position: { x: 100, y: 10 },
		dimensions: { width: 20, height: 20 },
		laserInteractable: true
	}));

	puzzle.addExit(new Exit({
		key: 'exitKey',
		position: { x: 100, height: 190},
		dimensions: { width: 10, height: 10 },
		direction: Direction.EAST
	}));

	puzzle.addTarget(new Target({
		key: 'targetKey',
		laserKey: 'laserKey',
		exitKey: 'exitKey',
		position: { x: 90, y: 100 },
		dimensions: { width: 20, height: 20 },
		laserInteractable: true
	}));

	// Okay--instead of checking the laser's path, we are going to check if the various conditions are valid
	puzzle.solve();

	assert.ok(puzzle.lasers['laserKey'].path, 'Laser should have a path assigned to it');
	assert.ok(puzzle.targets['targetKey'].isLit(), 'Target should be lit');
	assert.ok(puzzle.targets['targetKey'].isStruckBy('laserKey'), 'Target should be struck by laserKey');
	assert.ok(puzzle.exits['exitKey'].isOpen, 'Exit should be open');
});

// TODO: Add test that checks if a puzzle is not solved

// TODO: Check if a puzzle that is not solved is not solved, then move the pieces, and ensure that it is solved right after