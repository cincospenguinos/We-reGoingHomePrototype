/**
 * puzzleHelper.js
 *
 * Helper class. Holds static functions that generate the various puzzles.
 */
import { Puzzle } from '../model/puzzle.js';
import { Surface } from '../model/surface.js';
import { Laser } from '../model/laser.js';
import { Panel } from '../model/panel.js';
import { KEYS, DIRECTION } from '../../lib/CONST.js';

export class PuzzleHelper {

	/** Returns a puzzle object with all of the data outlined in the data hash provided. */
	static getPuzzle(scene, puzzleKey) {
		let puzzleData = scene.cache.json.get(KEYS.puzzles.key)[puzzleKey];
		console.log(puzzleData);

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
			puzzle.addPanel(new Panel({
				position: panelData.position,
				dimensions: panelData.dimensions
			}));
		});

		// TODO: Exits?

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
}