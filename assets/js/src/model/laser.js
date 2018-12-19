/**
 * laser.js
 *
 * Represents a laser in a puzzle.
 */
import { Direction } from './direction.js';
import { PuzzleItem } from './puzzleItem.js';

export class Laser extends PuzzleItem {
	
	constructor(opts) {
		super(opts);

		this.key = opts.key;
		this.color = opts.color;
		this.exitKeys = opts.exitKeys;
		
		this.terminatesLaser = true;

		if (!this.key || !this.exitKeys || !Direction.validDirection(this.direction)) {
			throw 'Laser key, a set of exit keys, and a direction required for laser!';
		}
	}

	/** Sets the img to the img provided. */
	setImg(img) {
		super.setImg(img);

		let angle = Direction.angleFromDirection(this.direction);
		this.img.setAngle(angle);
	}

	/** Returns the point from which the light of this laser extends. */
	getLaserPoint() {
		let position = this.getPosition();
		let dimensions = this.getDimensions();

		switch(this.direction) {
		case Direction.EAST:
			return { x: position.x + dimensions.width / 2, y: position.y };
		case Direction.SOUTH:
			return { x: position.x, y: position.y + dimensions.height / 2 };
		case Direction.NORTH:
			return { x: position.x, y: position.y - dimensions.height / 2 };
		case Direction.WEST:
			return { x: position.x - dimensions.width / 2, y: position.y };
		default:
			throw 'Direction "' + this.direction + '" is invalid';
		}
	}
}