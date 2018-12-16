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
import { PuzzleItem } from './puzzleItem.js';

export class Surface extends PuzzleItem {

	constructor(opts) {
		super(opts);

		this.type = opts.type;
		this.reflectiveDirection = opts.reflectiveDirection;
		this.isTarget = opts.isTarget || false;
		this.movable = opts.movable || false;
	}

	/** Returns a collision point, or null if none exists. */
	getCollisionPoint(point, approachingDirection) {
		let extrema = this.getExtrema();
		let centerPoint = this.getPosition();

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

	/** Included for the case that we need to rotate and modify the reflective direction. */
	rotate(degrees) {
		super.rotate(degrees);

		if (this.type === Surface.REFLECTIVE) {
			this.reflectiveDirection = PuzzleItem.rotatedDirection(this.reflectiveDirection, degrees);
		}
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