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

		this.isOpen = opts.isOpen || false;

		if (!this.key || !this.color || !(this.color instanceof LaserColor) || !Direction.validDirection(this.direction)) {
			// throw 'A key, laser color, and valid direction are necessary to instantiate an Exit!';
			console.warn('A key, laser color, and valid direction are necessary to instantiate an Exit!');
		}
	}

	/** Sets whether or not the door is open. */
	setOpen(open) {
		this.isOpen = open;
		this.setProperFrame();
	}

	setImg(img) {
		super.setImg(img);
		this.setProperFrame();
	}

	setColor(color) {
		this.color = color;
		this.setProperFrame();
	}

	/** Helper method. Returns true if the direction of the exit is located in either the north or south. */
	useHorizontalDoor() {
		return this.direction === Direction.NORTH || this.direction === Direction.SOUTH;
	}

	setProperFrame() {
		if (this.img) {
			let frame = 0;

			if (this.color === LaserColor.RED) {
				this.img.setFrame(0);
			} else if (this.color === LaserColor.BLUE) {
				this.img.setFrame(8);
			} else if (this.color === LaserColor.GREEN) {
				this.img.setFrame(16);
			} else {
				throw 'LaserColor is not valid!';
			}

			if (this.isOpen) {
				frame += 4;
			}

			switch(this.direction) {
			case Direction.EAST:
				frame += 1;
				break;
			case Direction.SOUTH:
				frame += 3;
				break;
			case Direction.WEST:
				frame += 2;
				break;
			case Direction.NORTH:
				break;
			default:
				throw 'No direction found for exit!';
			}

			this.img.setFrame(frame);
		}
	}

	/** Resets this exit to be "closed" in accordance to the puzzle solution setting thigns up again. */
	reset() {
		this.isOpen = false;
	}

	/** Override toJSON(). Ensures that puzzle items have all their necessary components. */
	toJSON() {
		let obj = super.toJSON();
		obj.color = this.color.key;
		return obj;
	}
}