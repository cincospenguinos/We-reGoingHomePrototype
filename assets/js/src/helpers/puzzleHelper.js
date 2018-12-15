/**
 * puzzleHelper.js
 *
 * Helper class. Holds static functions that generate the various puzzles.
 */
import { Puzzle } from '../model/puzzle.js';
import { Surface } from '../model/surface.js';
import { Laser } from '../model/laser.js';
import { Exit } from '../model/exit.js';
import { PuzzleItem } from '../model/puzzleItem.js';
import { KEYS, DIRECTION } from '../../lib/CONST.js';

export class PuzzleHelper {

	/** Returns a puzzle object with all of the data outlined in the data hash provided. */
	static getPuzzle(scene, puzzleKey) {
		let puzzleData = scene.cache.json.get(KEYS.puzzles.key)[puzzleKey];

		let puzzle = new Puzzle(puzzleData.dimensions.width, puzzleData.dimensions.height);
		puzzle.laser = new Laser({
			direction: this.directionFromString(puzzleData.laser.direction),
			dimensions: puzzleData.laser.dimensions,
			movable: puzzleData.laser.movable,
			position: puzzleData.laser.position
		});

		puzzleData.surfaces.forEach((surfaceData) => {
			puzzle.addSurface(new Surface({
				type: this.surfaceTypeFromString(surfaceData.type),
				isTarget: surfaceData.isTarget,
				movable: surfaceData.movable,
				position: surfaceData.position,
				dimensions: surfaceData.dimensions
			}));
		});

		puzzleData.panels.forEach((panelData) => {
			puzzle.addPanel(new PuzzleItem({
				position: panelData.position,
				dimensions: panelData.dimensions
			}));
		});

		puzzleData.exits.forEach((exitData) => {
			let direction = this.directionFromString(exitData.direction);
			let position = this.getDoorPosition(scene, direction);

			puzzle.addExit(new Exit({
				position: position,
				nextRoomKey: exitData.nextPuzzle,
				direction: direction
			}));
		})

		return puzzle;
	}

	/** Helper method. Returns the direction given a direction string. */
	static directionFromString(str) {
		if (str === 'EAST') {
			return DIRECTION.EAST;
		} else if (str === 'SOUTH') {
			return DIRECTION.SOUTH;
		} else if (str === 'WEST') {
			return DIRECTION.WEST;
		} else if (str === 'NORTH') {
			return DIRECTION.NORTH;
		}

		throw 'Direction "' + str + '" is an invalid direction!'
	}

	/** Helper method. Returns the surface type given the string provided. */
	static surfaceTypeFromString(str) {
		if (str === 'OPAQUE') {
			return Surface.OPAQUE;
		} else if (str === 'REFLECTIVE') {
			return Surface.REFLECTIVE;
		}

		throw 'Surface type "' + str + '" is invalid!';
	}

	/** Helper method. gets the door position given the scene and the direction. */
	static getDoorPosition(scene, direction) {
		switch(direction) {
		case DIRECTION.EAST:
			return { x: scene.sys.canvas.width - 8, y: scene.sys.canvas.height / 2 };
		case DIRECTION.SOUTH:
			return { x: scene.sys.canvas.width / 2, y: scene.sys.canvas.height - 8 };
		case DIRECTION.WEST:
			return { x: 8, y: scene.sys.canvas.height / 2 };
		case DIRECTION.NORTH:
			return { x: scene.sys.canvas.width / 2, y: 8 };
		}
	}
}