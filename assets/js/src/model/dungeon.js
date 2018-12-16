/**
 * dungeon.js
 *
 * A dungeon is a set of rooms that the player can interact with. Each room is a puzzle, and vice-versa.
 */
import { Puzzle } from './puzzle.js';

export class Dungeon {

	constructor() {
		this.puzzles = {};
	}

	/** Adds the puzzle to the collection. */
	addPuzzle(key, puzzle) {
		if (puzzle instanceof Puzzle) {
			this.puzzles[key] = puzzle;
		} else {
			throw 'Object "' + puzzle + '" is not a puzzle!'
		}
	}

	/** Get the puzzle matching the key provided. */
	getPuzzle(key) {
		let puzzle = this.puzzles[key];

		if (!puzzle) {
			throw 'No puzzle with key "' + key + '" was found!';
		}

		return puzzle;
	}
}