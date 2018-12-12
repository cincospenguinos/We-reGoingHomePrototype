/**
 * surface.js
 *
 * Class representing a surface that a laser can hit.
 *
 * Since we're following the MVC architecture, we have to find a way to have a model be able to do
 * all of the logic of our game while letting it be anchored into some sort of view. The solution
 * that I came up with was to let the surface either take an image from Phaser, or position and
 * dimensions from the user to establish where it may be in space. Then we will use methods to
 * grab that data as needed in the various methods that manage it. This way we can test if our
 * algorithms work without having to write tons of code to do it.
 */
import { DIRECTION } from '../../lib/CONST.js';

export class Surface {

	constructor(opts) {
		this.type = opts.type;
		this.reflectiveDirection = opts.reflectiveDirection;
		this.isTarget = opts.isTarget || false;
		this.movable = opts.movable || false;

		if (opts.img) {
			this.img = opts.img
		} else {
			this.position = opts.position;
			this.dimensions = opts.dimensions;
		}
	}

	/** Returns the position of this surface object. */
	getPosition() {
		return this.img ? { x: this.img.x, y: this.img.y } : this.position;
	}

	/** Returns the dimensions of this surface. */
	getDimensions() {
		return this.img ? { width: this.img.displayWidth, height: this.img.displayHeight } : this.dimensions;
	}

	/** Returns a collision point, or null if none exists. */
	getCollisionPoint(point, approachingDirection) {
		let extrema = this.getExtrema();

		switch(approachingDirection) {
		case DIRECTION.EAST:
			if (point.x < extrema.x.min && point.y > extrema.y.min && point.y < extrema.y.max) {
				return { x: extrema.x.min, y: point.y };
			}

			break;
		case DIRECTION.SOUTH:
			if (point.y < extrema.y.min && point.x > extrema.x.min && point.x < extrema.x.max) {
				return { x: point.x, y: extrema.y.min };
			}

			break;
		case DIRECTION.WEST:
			if (point.x > extrema.x.max && point.y > extrema.y.min && point.y < extrema.y.max) {
				return { x: extrema.x.max, y: point.y};
			}

			break;
		case DIRECTION.NORTH:
			if (point.y > extrema.y.max && point.x > extrema.x.min && point.x < extrema.x.max) {
				return { x: point.x, y: extrema.y.max };
			}

			break;
		default:
			throw 'Direction "' + approachingDirection + '" not valid!'
		}

		return null;
	}

	/** Helper method. Returns the extrema to be used in calculating the collision point.*/
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

	/** Static helper method. Returns closest surface to the point provided. */
	static closestSurface(point, surface1, surface2) {
		let s1Pnt = surface1.getPosition();
		let s2Pnt = surface2.getPosition();

		let dist1 = { x: Math.abs(point.x - s1Pnt.x), y: Math.abs(point.y - s1Pnt.y) }
		let dist2 = { x: Math.abs(point.x - s2Pnt.x), y: Math.abs(point.y - s2Pnt.y) }

		if (Math.sqrt(dist1.x * dist1.x + dist1.y * dist1.y) < Math.sqrt(dist2.x * dist2.x + dist2.y * dist2.y)) {
			return surface1;
		} else {
			return surface2;
		}
	}
}

Surface.REFLECTIVE = '__reflective__';
Surface.OPAQUE = '__opaque__';