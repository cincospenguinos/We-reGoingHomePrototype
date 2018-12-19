/**
 * surface.js
 *
 * Class representing a surface that a laser can hit.
 *
 * NOTE: If this is a reflective surface (mirror,) then we will use the direction to determine where the
 *       reflective surface is. East means that it is facing east.
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
		this.terminatesLaser = this.type === Surface.REFLECTIVE ? false : true;
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
			this.reflectiveDirection = PuzzleItem.rotatedDirection(this.direction, degrees);
		}
	}

	/** Returns the reflective direction of this surface given the direction the laser is approaching, or null if it does not reflect.*/
	reflectiveDirection(approachingDirection) {// NOTE: approachingDirection means "the laser is going in that direction"
		if (this.type === Surface.REFLECTIVE) {
			switch(this.direction) {
			case Direction.EAST:
				if (approachingDirection === Direction.SOUTH) {
					return Direction.EAST;
				} else if (approachingDirection === Direction.WEST) {
					return Direction.NORTH;
				}

				return null;
			case Direction.SOUTH:
				if (approachingDirection === Direction.WEST) {
					return Direction.SOUTH;
				} else if (approachingDirection === Direction.NORTH) {
					return Direction.EAST;
				}

				return null;
			case Direction.WEST:
				if (approachingDirection === Direction.EAST) {
					return Direction.SOUTH;
				} else if (approachingDirection === Direction.NORTH) {
					return Direction.WEST;
				}

				return null;
			case Direction.NORTH:
				if (approachingDirection === Direction.EAST) {
					return Direction.NORTH;
				} else if (approachingDirection === Direction.SOUTH) {
					return Direction.WEST;
				}

				return null;
			}
		}
	}

	/** Helper method. Returns the surface type enum from the string provided. */
	static typeFromString(str) {
		if (str === 'OPAQUE') {
			return Surface.OPAQUE;
		} else if (str === 'REFLECTIVE') {
			return Surface.REFLECTIVE;
		}

		throw 'Surface type "' + str + '" is invalid!';
	}
}

Surface.REFLECTIVE = '__reflective__';
Surface.OPAQUE = '__opaque__';