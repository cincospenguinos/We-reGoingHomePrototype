/**
 * puzzleItem.js
 *
 * Represents a puzzle item. This is to avoid code duplication.
 */
import { COLORS } from '../../lib/CONST.js';
import { Direction } from './direction.js';

export class PuzzleItem {

	constructor(opts) {
		this.position = opts.position;
		this.dimensions = opts.dimensions;
		this.direction = opts.direction;
		this.movable = opts.movable || false;
		this.rotatable = opts.rotatable || false;
		this.laserInteractable = opts.laserInteractable || false;
		this.terminatesLaser = opts.terminatesLaser || false;

		if (!this.position || !this.dimensions) {
			console.warn('PuzzleItem must have starting position and dimensions!');
		}
	}

	/** Rotates the puzzle item the number of degrees provided. Must either be 90 or -90. */
	rotate(degrees) {
		this.direction = Direction.directionFromRotation(this.direction, degrees);

		if (this.img) {
			this.img.setAngle(Direction.angleFromDirection(this.direction));
		}
	}

	/** Returns the position of this puzzle item. */
	getPosition() {
		return this.img ? { x: this.img.x, y: this.img.y } : this.position;
	}

	/** Sets the position of this puzzle item. */
	setPosition(pos) {
		if (this.img) {
			this.img.x = pos.x;
			this.img.y = pos.y;
		} else {
			this.position = pos;
		}
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

	/** Sets the proper frame for the puzzle item. */
	setProperFrame(isRoom = false) { throw 'Implement me!' }

	/** Helper method. To be used by children classes to modify their sprite when moused over in puzzle mode. */
	mouseOver() { throw 'Implement me in children!'; }

	/** Helper method. To be used by children classes to modify their sprite when moused over in puzzle mode. */
	mouseOut() { throw 'Implement me in children!'; }

	runAnimation() { throw 'Implement me in children!';	}

	/** Returns the collision point of this puzzle item. Returns null if this item does not interact with a laser, or if the laser does not hit this item. 
		Note that the direction provided is the direction the item at the point provided is facing. */
	getLaserCollisionPoint(point, direction) {
		let extrema = this.getExtrema();
		let p = this.getPosition();
		let d = this.getDimensions();

		if (this.laserInteractable) {
			switch(direction) {
			case Direction.EAST:
				return point.y > extrema.y.min && point.y < extrema.y.max && point.x < p.x ? { x: p.x - d.width / 2, y: point.y } : null;
			case Direction.SOUTH:
				return point.x > extrema.x.min && point.x < extrema.x.max && point.y < p.y ? { x: point.x, y: p.y - d.height / 2 } : null;
			case Direction.WEST:
				return point.y > extrema.y.min && point.y < extrema.y.max && point.x > p.x ? { x: p.x + d.width / 2, y: point.y } : null;
			case Direction.NORTH:
				return point.x > extrema.x.min && point.x < extrema.x.max && point.y > p.y ? { x: point.x, y: p.y + d.height / 2 } : null;
			}
		} else {
			return null;
		}
	}

	setProperFrame() {} // Unused, and not required

	interactable() { return this.movable || this.rotatable; }

	/** Sets the image to the image provided. */
	setImg(img) {
		this.img = img;
	}

	/** Resets the img of this puzzle item. Fixes a weird bug I found. */
	resetImg() {
		if (this.img) {
			this.position = this.getPosition();
			this.img = null;
		}
	}

	/** Override toJSON(). Ensures that puzzle items have all their necessary components. */
	toJSON() {
		return {
			key: this.key,
			position: this.getPosition(),
			dimensions: this.getDimensions(),
			direction: this.direction,
			movable: this.movable,
			rotatable: this.rotatable
		}
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