/**
 * testHelper.js
 *
 * Variety of methods and things to help make test files cleaner.
 */
import { Puzzle } from '../src/model/puzzle.js';
import { Laser } from '../src/model/laser.js';
import { LaserColor } from '../src/model/laserColor.js'
import { Direction } from '../src/model/direction.js';
import { Exit } from '../src/model/exit.js';
import { Target } from '../src/model/target.js';
import { Surface } from '../src/model/surface.js';

export class TestHelper {
	static createPuzzle(opts) {
		return new Puzzle({...TestHelper.defaults.puzzle, ...opts});
	}

	static createLaser(opts) {
		return new Laser({...TestHelper.defaults.laser, ...opts});
	}

	static createSurface(opts) {
		return new Surface({...TestHelper.defaults.surface, ...opts});
	}

	static createTarget(opts) {
		return new Target({...TestHelper.defaults.target, ...opts});
	}

	static createExit(opts) {
		return new Exit({...TestHelper.defaults.exit, ...opts})
	}
}

/*-- VALUES */
TestHelper.laserColors = {
	red: LaserColor.RED,
	green: LaserColor.GREEN,
	blue: LaserColor.BLUE,
	orange: LaserColor.ORANGE,
	purple: LaserColor.PURPLE,
	yellow: LaserColor.YELLOW,
	white: LaserColor.WHITE,
}

TestHelper.directions = {
	east: Direction.EAST,
	south: Direction.SOUTH,
	west: Direction.WEST,
	north: Direction.NORTH,
}

/*-- DEFAULTS */
TestHelper.defaults = {
	puzzle: {
		dimensions: { width: 200, height: 200 },
		key: 'somepuzzle',
		roomKey: 'someroom',
		mapName: 'name'
	},

	laser: {
		color: TestHelper.laserColors.red,
		key: 'laser',
		laserInteractable: true,
	},

	surface: {
		type: Surface.REFLECTIVE,
		laserInteractable: true
	},

	target: {
		key: 'target',
		laserInteractable: true
	},

	exit: {
		key: 'exit',
		color: TestHelper.laserColors.red,
	}
};