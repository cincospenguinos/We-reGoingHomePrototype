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