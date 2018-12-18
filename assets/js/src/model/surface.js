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
 *
 * TODO: Override getCollisionPoint case
 */
import { Direction } from './direction.js';
import { PuzzleItem } from './puzzleItem.js';

export class Surface extends PuzzleItem {

	constructor(opts) {
		super(opts);

		this.type = opts.type;
		if (this.type === Surface.REFLECTIVE && !Direction.validDirection(this.direction)) {
			throw 'Reflective surface requires a direction to direct lasers to!';
		}

		this.laserInteractable = true;
		this.type === Surface.REFLECTIVE ? this.terminatesLaser = false : this.terminatesLaser = true;
	}

	/** Returns a collision point, or null if none exists. */
	// getLaserCollisionPoint(point, direction) {
	// 	return super.getLaserCollisionPoint(point, direction);

	// 	// TODO: Override this for the mirror case
	// 	// let extrema = this.getExtrema();
	// 	// let centerPoint = this.getPosition();

	// 	// switch(direction) {
	// 	// case Direction.EAST:
	// 	// 	if (point.x < extrema.x.min && point.y > extrema.y.min && point.y < extrema.y.max) {
	// 	// 		return { x: extrema.x.min, y: point.y };
	// 	// 	}

	// 	// 	break;
	// 	// case Direction.SOUTH:
	// 	// 	if (point.y < extrema.y.min && point.x > extrema.x.min && point.x < extrema.x.max) {
	// 	// 		return { x: point.x, y: extrema.y.min };
	// 	// 	}

	// 	// 	break;
	// 	// case Direction.WEST:
	// 	// 	if (point.x > extrema.x.max && point.y > extrema.y.min && point.y < extrema.y.max) {
	// 	// 		return { x: extrema.x.max, y: point.y};
	// 	// 	}

	// 	// 	break;
	// 	// case Direction.NORTH:
	// 	// 	if (point.y > extrema.y.max && point.x > extrema.x.min && point.x < extrema.x.max) {
	// 	// 		return { x: point.x, y: extrema.y.max };
	// 	// 	}

	// 	// 	break;
	// 	// }

	// 	// return null;
	// }

	/** Included for the case that we need to rotate and modify the reflective direction. */
	rotate(degrees) {
		super.rotate(degrees);

		if (this.type === Surface.REFLECTIVE) {
			this.direction = PuzzleItem.rotatedDirection(this.direction, degrees);
		}
	}
}

Surface.REFLECTIVE = '__reflective__';
Surface.OPAQUE = '__opaque__';