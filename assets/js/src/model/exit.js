/**
 * exit.js
 *
 * An exit from a puzzle room to another.
 */
import { Direction } from './direction.js';

export class Exit {
	
	constructor(opts) {
		this.key = opts.key;
		this.position = opts.position;
		this.nextPuzzleKey = opts.nextPuzzleKey;
		this.direction = opts.direction;

		this.isOpen = false;

		if (!this.key || !Direction.validDirection(this.direction)) {
			throw 'key and direction are required for Exit!';
		}
	}

	/** Helper method. Returns true if the direction of the exit is located in either the north or south. */
	useHorizontalDoor() {
		return this.direction === Direction.NORTH || this.direction === Direction.SOUTH;
	}
}