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
			if (this.color === LaserColor.RED) {
				this.img.setFrame(0);
			} else if (this.color === LaserColor.BLUE) {
				this.img.setFrame(1);
			} else if (this.color === LaserColor.GREEN) {
				this.img.setFrame(2);
			} else {
				throw 'LaserColor is not valid!';
			}

			if (this.isOpen) {
				this.img.setFrame(this.img.frame.name + 4);
			}
		}
	}

	/** Override toJSON(). Ensures that puzzle items have all their necessary components. */
	toJSON() {
		let obj = super.toJSON();
		obj.color = this.color.key;
		return obj;
	}
}