/**
 * laser.js
 *
 * Represents a laser in a puzzle.
 */
import { DIRECTION } from '../../lib/CONST.js';

export class Laser {
	
	constructor(opts) {
		this.direction = opts.direction;
		this.movable = opts.movable || false;

		if (opts.img) {
			this.img = opts.img;
		} else {
			this.position = opts.position;
			this.dimensions = opts.dimensions;
		}
	}

	/** Returns the point from which the light of this laser extends. */
	getLaserPoint() {
		let position = this.getPosition();
		let dimensions = this.getDimensions();

		switch(this.direction) {
		case DIRECTION.EAST:
			return { x: position.x + dimensions.width / 2, y: position.y };
		case DIRECTION.SOUTH:
			return { x: position.x, y: position.y + dimensions.height / 2 };
		case DIRECTION.NORTH:
			return { x: position.x, y: position.y - dimensions.height / 2 };
		case DIRECTION.WEST:
			return { x: position.x - dimensions.width / 2, y: position.y };
		default:
			throw 'Direction "' + this.direction + '" is invalid';
		}
	}

	/** Returns the position of this laser. */
	getPosition() {
		return this.img ? { x: this.img.x, y: this.img.y } : this.position;
	}

	/** Returns the dimensions of this laser. */
	getDimensions() {
		return this.img ? { width: this.img.displayWidth, height: this.img.displayHeight } : this.dimensions;
	}
}