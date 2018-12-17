/**
 * puzzleItem.js
 *
 * Represents a puzzle item. This is to avoid code duplication.
 */
import { COLORS, DIRECTION } from '../../lib/CONST.js';

export class PuzzleItem {

	constructor(opts) {
		if (!opts.position || !opts.dimensions) {
			throw 'PuzzleItem must have starting position and dimensions!';
		}

		this.direction = opts.direction;
		this.position = opts.position;
		this.dimensions = opts.dimensions;
		this.movable = opts.movable || false;
		this.rotatable = opts.rotatable || false;
		this.direction = opts.direction;
	}

	/** Modifies image of this puzzle item when the pointer is over it. */
	pointerOver() {
		if (this.img) {
			if (this.movable && this.rotatable) {
				this.img.setTint(COLORS.movableAndRotatable);
			} else if (this.movable) {
				this.img.setTint(COLORS.movable);
			} else if (this.rotatable) {
				this.img.setTint(COLORS.rotatable);
			}
		}
	}

	/** Modifies the image of this puzzle item when the pointer leaves it. */
	pointerOut() {
		if (this.img) {
			this.img.clearTint();
		}
	}

	/** Rotates the puzzle item the number of degrees provided. Must either be 90 or -90. */
	rotate(degrees) {
		if (this.img && PuzzleItem.validDirection(this.direction)) {
			let newDirection = PuzzleItem.rotatedDirection(this.direction, degrees);
			let angle = PuzzleItem.angleFor(newDirection);

			this.img.setAngle(angle);
			this.direction = newDirection;
		} else {
			throw 'No image or direction found for this object!';
		}
	}

	/** Returns the position of this puzzle item. */
	getPosition() {
		return this.img ? { x: this.img.x, y: this.img.y } : this.position;
	}

	/** Returns the dimensions of this puzzle item. */
	getDimensions() {
		return this.img ? { width: this.img.displayWidth, height: this.img.displayHeight } : this.dimensions;
	}

	/** Helper method. Returns the extrema to be used in calculating collision points.*/
	getExtrema() {
		let extrema = { x: {}, y: {} };

		if (this.img) {
			extrema.x.min = this.img.x - this.img.displayWidth / 2;
			extrema.x.max = this.img.x + this.img.displayWidth / 2;
			extrema.y.min = this.img.y - this.img.displayHeight / 2;
			extrema.y.max = this.img.y + this.img.displayHeight / 2
		} else {
			extrema.x.min = this.position.x - this.dimensions.width / 2;
			extrema.x.max = this.position.x + this.dimensions.width / 2;
			extrema.y.min = this.position.y - this.dimensions.height / 2;
			extrema.y.max = this.position.y + this.dimensions.height / 2
		}

		return extrema;
	}

	/** Sets the image to the image provided. */
	setImg(img) {
		this.img = img;
	}

	/** Helper method. Returns the direction after the angle passed is provided. */
	static rotatedDirection(direction, angle) {
		if (Math.abs(angle) !== 90) {
			throw '"' + angle + '" is an invalid number of degrees. Please only use +90 or -90'
		}

		if (angle > 0) {
			switch(direction) {
			case DIRECTION.EAST:
				return DIRECTION.SOUTH;
			case DIRECTION.SOUTH:
				return DIRECTION.WEST;
			case DIRECTION.WEST:
				return DIRECTION.NORTH;
			case DIRECTION.NORTH:
				return DIRECTION.EAST;
			default:
				throw 'Direction "' + direction + '" is invalid!'
			}
		} else {
			switch(direction) {
			case DIRECTION.EAST:
				return DIRECTION.NORTH;
			case DIRECTION.SOUTH:
				return DIRECTION.EAST;
			case DIRECTION.WEST:
				return DIRECTION.SOUTH;
			case DIRECTION.NORTH:
				return DIRECTION.WEST;
			default:
				throw 'Direction "' + direction + '" is invalid!'
			}
		}
	}

	/** Helper method. Returns the angle in degrees corresponding to the direction provided. */
	static angleFor(direction) {
		switch(direction) {
		case DIRECTION.EAST:
			return 0;
		case DIRECTION.SOUTH:
			return 90;
		case DIRECTION.WEST:
			return 180;
		case DIRECTION.NORTH:
			return 270;
		default:
			throw 'Direction "' + direction + '" is invalid!'
		}
	}

	static validDirection(direction) {
		return DIRECTION.EAST === direction || DIRECTION.SOUTH === direction
			|| DIRECTION.WEST === direction || DIRECTION.NORTH === direction;
	}
}