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
import { Player } from '../src/model/player.js';
import { LaserColor } from '../src/model/laserColor.js';

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

/*--- LaserColor tests */
QUnit.test('laserColorBlends', (assert) => {
	assert.equal(LaserColor.blend([LaserColor.RED, LaserColor.GREEN]), LaserColor.ORANGE, 'RED + GREEN = ORANGE');
	assert.equal(LaserColor.blend([LaserColor.RED, LaserColor.BLUE]), LaserColor.PURPLE, 'RED + BLUE = PURPLE');
	assert.equal(LaserColor.blend([LaserColor.GREEN, LaserColor.BLUE]), LaserColor.YELLOW, 'GREEN + BLUE = YELLOW');
	assert.equal(LaserColor.blend([LaserColor.RED, LaserColor.RED]), LaserColor.RED, 'Blending the same color returns the same color');
	assert.equal(LaserColor.blend([LaserColor.RED, LaserColor.GREEN, LaserColor.BLUE]), LaserColor.WHITE, 'Blending all the colors yields white');
	assert.equal(LaserColor.blend([LaserColor.RED, LaserColor.GREEN, LaserColor.RED]), LaserColor.ORANGE, 'Multiples of a color make no difference.')
});

/*--- Target tests */
QUnit.test('targetBlendByLasers', (assert) => {
	let puzzle = new Puzzle({
		dimensions: { width: 200, height: 200 },
		key: 'somepuzzle',
		roomKey: 'someroom'
	});

	puzzle.addLaser(new Laser({
		key: 'laser',
		color: LaserColor.RED,
		direction: Direction.EAST,
		position: { x: 10, y: 10 },
		dimensions: { width: 0, height: 0 },
		laserInteractable: true
	}));

	puzzle.addLaser(new Laser({
		key: 'otherLaser',
		color: LaserColor.GREEN,
		direction: Direction.WEST,
		position: { x: 150, y: 10 },
		dimensions: { width: 0, height: 0 },
		laserInteractable: true
	}));

	puzzle.addTarget(new Target({
		key: 'target',
		position: { x: 50, y: 10 },
		dimensions: { width: 20, height: 20 },
		laserInteractable: true
	}));

	puzzle.solve();

	let target = puzzle.targets['target'];
	assert.ok(target.isLit(), 'Target should be lit');
	assert.ok(target.isStruckBy(LaserColor.RED), 'Target should be hit by red laser');
	assert.ok(target.isStruckBy(LaserColor.GREEN), 'Target should be hit by blue laser');
	assert.equal(target.color, LaserColor.ORANGE, 'Target should be lit orange.');
});

/*--- Puzzle tests */
QUnit.test('solvedPuzzle', (assert) => {
	let puzzle = new Puzzle({
		dimensions: { width: 200, height: 200 },
		key: 'somepuzzle',
		roomKey: 'someroom'
	});

	puzzle.addLaser(new Laser({
		key: 'laser',
		color: LaserColor.RED,
		direction: Direction.EAST,
		position: { x: 10, y: 10 },
		dimensions: { width: 0, height: 0 },
		laserInteractable: true
	}));

	puzzle.addSurface(new Surface({
		type: Surface.REFLECTIVE,
		direction: Direction.WEST,
		position: { x: 100, y: 10 },
		dimensions: { width: 20, height: 20 },
		laserInteractable: true
	}));

	puzzle.addExit(new Exit({
		key: 'exit',
		color: LaserColor.RED,
		position: { x: 100, height: 190},
		dimensions: { width: 10, height: 10 },
		direction: Direction.EAST
	}));

	puzzle.addTarget(new Target({
		key: 'target',
		position: { x: 90, y: 100 },
		dimensions: { width: 20, height: 20 },
		laserInteractable: true
	}));

	// Okay--instead of checking the laser's path, we are going to check if the various conditions are valid
	puzzle.solve();

	assert.ok(puzzle.lasers['laser'].path, 'Laser should have a path assigned to it');
	assert.ok(puzzle.targets['target'].isLit(), 'Target should be lit');
	assert.ok(puzzle.targets['target'].isStruckBy(LaserColor.RED), 'Target should be struck by red laser');
	assert.ok(puzzle.exits['exit'].isOpen, 'Exit should be open');
});

QUnit.test('solvedPuzzleWithBlendedColor', (assert) => {
	let puzzle = new Puzzle({
		dimensions: { width: 200, height: 200 },
		key: 'somepuzzle',
		roomKey: 'someroom'
	});

	puzzle.addLaser(new Laser({
		key: 'laser',
		color: LaserColor.RED,
		direction: Direction.EAST,
		position: { x: 10, y: 10 },
		dimensions: { width: 0, height: 0 },
		laserInteractable: true
	}));

	puzzle.addLaser(new Laser({
		key: 'otherLaser',
		color: LaserColor.GREEN,
		direction: Direction.WEST,
		position: { x: 150, y: 10 },
		dimensions: { width: 0, height: 0 },
		laserInteractable: true
	}));

	puzzle.addTarget(new Target({
		key: 'target',
		position: { x: 50, y: 10 },
		dimensions: { width: 20, height: 20 },
		laserInteractable: true
	}));

	puzzle.addExit(new Exit({
		key: 'exit',
		position: { x: 200, y: 200 },
		dimensions: { width: 0, height: 0 },
		direction: Direction.EAST,
		color: LaserColor.ORANGE
	}))

	puzzle.solve();

	let target = puzzle.targets['target'];
	assert.ok(target.isLit(), 'Target should be lit');
	assert.ok(target.isStruckBy(LaserColor.RED), 'Target should be hit by red laser');
	assert.ok(target.isStruckBy(LaserColor.GREEN), 'Target should be hit by blue laser');
	assert.equal(target.color, LaserColor.ORANGE, 'Target should be lit orange.');
	assert.ok(puzzle.exits['exit'].isOpen, 'Exit should be open.');
});

QUnit.test('notSolvedButThenSolved', (assert) => {
	let puzzle = new Puzzle({
		dimensions: { width: 200, height: 200 },
		key: 'somepuzzle',
		roomKey: 'someroom'
	});

	puzzle.addLaser(new Laser({
		key: 'laserKey',
		color: LaserColor.RED,
		direction: Direction.EAST,
		position: { x: 10, y: 10 },
		dimensions: { width: 0, height: 0 },
		laserInteractable: true
	}));

	let mirror = new Surface({
		type: Surface.REFLECTIVE,
		direction: Direction.WEST,
		position: { x: 100, y: 50 },
		dimensions: { width: 20, height: 20 },
		laserInteractable: true
	});
	puzzle.addSurface(mirror);

	puzzle.addExit(new Exit({
		key: 'exitKey',
		color: LaserColor.RED,
		position: { x: 100, height: 190},
		dimensions: { width: 10, height: 10 },
		direction: Direction.EAST
	}));

	puzzle.addTarget(new Target({
		key: 'targetKey',
		position: { x: 90, y: 100 },
		dimensions: { width: 20, height: 20 },
		laserInteractable: true
	}));

	puzzle.solve();

	assert.notOk(puzzle.targets['targetKey'].isLit(), 'Target should not be lit');
	assert.notOk(puzzle.targets['targetKey'].isStruckBy(LaserColor.RED), 'Target should not be struck by laserKey');
	assert.notOk(puzzle.exits['exitKey'].isOpen, 'Exit should not be open');

	mirror.position.y = 10;

	puzzle.solve();

	assert.ok(puzzle.lasers['laserKey'].path, 'Laser should have a path assigned to it');
	assert.ok(puzzle.targets['targetKey'].isLit(), 'Target should be lit');
	assert.ok(puzzle.targets['targetKey'].isStruckBy(LaserColor.RED), 'Target should be struck by laserKey');
	assert.ok(puzzle.exits['exitKey'].isOpen, 'Exit should be open');
});

QUnit.test('weirdLaserBug', (assert) => {
	let puzzle = new Puzzle({
		dimensions: { width: 200, height: 200 },
		key: 'somepuzzle',
		roomKey: 'someroom'
	});

	puzzle.addLaser(new Laser({
		key: 'laserKey',
		color: LaserColor.RED,
		direction: Direction.NORTH,
		position: { x: 10, y: 10 },
		dimensions: { width: 0, height: 0 },
		laserInteractable: true
	}));

	puzzle.addExit(new Exit({
		key: 'exitKey',
		color: LaserColor.RED,
		position: { x: 100, height: 190},
		dimensions: { width: 10, height: 10 },
		direction: Direction.EAST
	}));

	puzzle.addTarget(new Target({
		key: 'targetKey',
		position: { x: 10, y: 100 },
		dimensions: { width: 20, height: 20 },
		laserInteractable: true
	}));

	puzzle.solve();

	assert.notOk(puzzle.targets['targetKey'].isLit(), 'Target should not be lit');
});

QUnit.test('laserCannotHitPlayer', (assert) => {
	let puzzle = new Puzzle({
		dimensions: { width: 200, height: 200 },
		key: 'somepuzzle',
		roomKey: 'someroom'
	});

	puzzle.addLaser(new Laser({
		key: 'laserKey',
		color: LaserColor.RED,
		direction: Direction.SOUTH,
		position: { x: 10, y: 10 },
		dimensions: { width: 0, height: 0 },
		laserInteractable: true
	}));

	puzzle.player = new Player({
		position: { x: 6, y: 20 },
		dimensions: { width: 10, height: 10 },
	});

	puzzle.solve();

	assert.notOk(puzzle.valid);

	puzzle.player.position.x += 25;
	puzzle.solve();

	assert.ok(puzzle.valid);
});