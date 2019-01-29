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
		this.hasMouse = false;
	}

	setProperFrame(isRoom = false) {
		if (this.img) {
			let frame = 0;
			
			if (isRoom) {
				if (this.movable) frame += 1;
				if (this.rotatable) frame += 2;
			} else {
				if (this.movable) frame += 2;
				if (this.rotatable) frame += 4;
				if (this.hasMouse) frame += 1;
			}

			this.img.setFrame(frame);

			let angle = Direction.angleFromDirection(this.direction);
			this.img.setAngle(angle);
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

	mouseOver() {
		this.hasMouse = true;
		this.setProperFrame();
	}

	mouseOut() {
		this.hasMouse = false;
		this.setProperFrame();
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

	/** Helper method. Determines whether the type provided is or is not a valid type*/
	static validType(type) {
		return type === Surface.REFLECTIVE || type === Surface.OPAQUE;
	}
}

Surface.REFLECTIVE = '__reflective__';
Surface.OPAQUE = '__opaque__';