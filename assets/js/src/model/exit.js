/**
 * exit.js
 *
 * An exit from a puzzle room to another.
 */
import { DIRECTION } from '../../lib/CONST.js';

export class Exit {
	
	constructor(opts) {
		this.position = opts.position;
		this.nextPuzzleKey = opts.nextPuzzleKey;
		this.direction = opts.direction
	}

	/** Helper method. Returns true if the direction of the exit is located in either the north or south. */
	useHorizontalDoor() {
		return this.direction === DIRECTION.NORTH || this.direction === DIRECTION.SOUTH;
	}
}