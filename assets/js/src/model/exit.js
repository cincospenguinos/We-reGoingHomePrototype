/**
 * exit.js
 *
 * An exit from a puzzle room to another.
 */
import { PuzzleItem } from './puzzleItem.js';
import { Direction } from './direction.js';
import { LaserColor } from './laserColor.js';

export class Exit extends PuzzleItem {
	
	constructor(opts) {
		super(opts);

		this.key = opts.key;
		this.color = opts.color
		this.position = opts.position;
		this.nextRoomKey = opts.nextRoomKey;
		this.direction = opts.direction;
		this.nextRoomPlayerPosition = opts.nextRoomPlayerPosition;

		this.isOpen = false;

		if (!this.key || !this.color || !(this.color instanceof LaserColor) || !Direction.validDirection(this.direction)) {
			throw 'A key, laser color, and valid direction are necessary to instantiate an Exit!';
		}
	}

	/** Helper method. Returns true if the direction of the exit is located in either the north or south. */
	useHorizontalDoor() {
		return this.direction === Direction.NORTH || this.direction === Direction.SOUTH;
	}
}