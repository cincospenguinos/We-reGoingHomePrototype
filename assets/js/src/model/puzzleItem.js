/**
 * puzzleItem.js
 *
 * Represents a puzzle item. This is to avoid code duplication.
 */
import { COLORS } from '../../lib/CONST.js';
import { Direction } from './direction.js';

export class PuzzleItem {

	constructor(opts) {
		if (!opts.position || !opts.dimensions) {
			throw 'PuzzleItem must have starting position and dimensions!';
		}
		
		this.position = opts.position;
		this.dimensions = opts.dimensions;
		this.direction = opts.direction;
		this.movable = opts.movable || false;
		this.rotatable = opts.rotatable || false;
		this.laserInteractable = opts.laserInteractable || false;
	}

	/** Rotates the puzzle item the number of degrees provided. Must either be 90 or -90. */
	rotate(degrees) {
		throw 'Implement me!';
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

	/** Returns the collision point of this puzzle item. Returns null if this item does not interact with a laser, or if the laser does not hit this item. 
		Note that the direction provided is the direction that is approaching this item. */
	getLaserCollisionPoint(point, direction) {
		let extrema = this.getExtrema();
		let p = this.getPosition();
		let d = this.getDimensions();

		if (this.laserInteractable) {
			switch(direction) {
			case Direction.EAST:
				return point.y > extrema.y.min && point.y < extrema.y.max ? { x: p.x - d.width / 2, y: point.y } : null;
			case Direction.SOUTH:
				return point.x > extrema.x.min && point.x < extrema.x.max ? { x: point.x, y: p.y - d.height / 2 } : null;
			case Direction.WEST:
				return point.y > extrema.y.min && point.y < extrema.y.max ? { x: p.x + d.width / 2, y: point.y } : null;
			case Direction.NORTH:
				return point.x > extrema.x.min && point.x < extrema.x.max ? { x: point.x, y: p.y + d.height / 2 } : null;
			}
		} else {
			return null;
		}
	}

	/** Sets the image to the image provided. */
	setImg(img) {
		this.img = img;
	}

	/** Helper method. Returns the item closest to the */
	static closestItem(point, item1, item2) {
		let s1Pnt = item1.getPosition();
		let s2Pnt = item2.getPosition();

		let dist1 = { x: Math.abs(point.x - s1Pnt.x), y: Math.abs(point.y - s1Pnt.y) }
		let dist2 = { x: Math.abs(point.x - s2Pnt.x), y: Math.abs(point.y - s2Pnt.y) }

		if (Math.sqrt(dist1.x * dist1.x + dist1.y * dist1.y) < Math.sqrt(dist2.x * dist2.x + dist2.y * dist2.y)) {
			return item1;
		} else {
			return item2;
		}
	}
}