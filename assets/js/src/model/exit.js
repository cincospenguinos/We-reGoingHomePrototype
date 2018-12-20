/**
 * exit.js
 *
 * An exit from a puzzle room to another.
 */
import { PuzzleItem } from './puzzleItem.js';
import { Direction } from './direction.js';

export class Exit extends PuzzleItem {
	
	constructor(opts) {
		super(opts);

		this.key = opts.key;
		this.laserKeys = opts.laserKeys;
		this.position = opts.position;
		this.nextRoomKey = opts.nextRoomKey;
		this.direction = opts.direction;
		this.nextRoomPlayerPosition = opts.nextRoomPlayerPosition;

		this.isOpen = false;

		if (!this.key || !this.laserKeys || !Direction.validDirection(this.direction)) {
			throw 'key, laser keys, and direction are required for Exit!';
		}
	}

	/** Helper method. Returns true if the direction of the exit is located in either the north or south. */
	useHorizontalDoor() {
		return this.direction === Direction.NORTH || this.direction === Direction.SOUTH;
	}
}