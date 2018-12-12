/**
 * puzzleHelper.js
 *
 * Helper class. Holds static functions that generate the various puzzles.
 */
import { Puzzle } from '../model/puzzle.js';
import { Surface } from '../model/surface.js';
import { Laser } from '../model/laser.js';
import { DIRECTION } from '../../lib/CONST.js';

export class PuzzleHelper {

	/** Returns the first puzzle of the demo given the width and height of the canvas. */
	static puzzleOne(width, height) {
		let puzzle = new Puzzle(width, height);

		puzzle.laser = new Laser({
			direction: DIRECTION.EAST,
			movable: false,
			position: { x: 32, y: 32 },
			dimensions: { width: 64, height: 64}
		});

		puzzle.addSurface(new Surface({
			type: Surface.OPAQUE,
			isTarget: true,
			movable: true,
			position: { x: 3 * width / 4, y: 4 * height / 5 },
			dimensions: { width: 64, height: 64 }
		}));

		return puzzle;
	}	
}