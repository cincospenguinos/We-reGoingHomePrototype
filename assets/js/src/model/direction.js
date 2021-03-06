/**
 * direction.js
 *
 * Representation of a single direction. It's actually just an enum, but don't worry about it.
 */
export class Direction {

	/** Helper method. Returns a new direction given an old one and the number of degrees you want to rotate. */
	static directionFromRotation(direction, degrees) {
		let shift = degrees > 0 ? degrees % 90 + 1 : -(degrees % 90 + 1);
		let newDir = direction + shift;
		return newDir < 0 ? newDir + 4 : newDir % 4;
	}

	static validDirection(direction) {
		return direction >= 0 && direction <= 3;
	}

	/** Helper method. Returns the direction given a direction string. */
	static directionFromString(str) {
		if (str === 'EAST') {
			return Direction.EAST;
		} else if (str === 'SOUTH') {
			return Direction.SOUTH;
		} else if (str === 'WEST') {
			return Direction.WEST;
		} else if (str === 'NORTH') {
			return Direction.NORTH;
		}

		return undefined;
	}

	/** Helper method. Returns a string matching the direction provided. */
	static stringFromDirection(direction) {
		switch(direction) {
		case Direction.EAST:
			return 'EAST';
		case Direction.SOUTH:
			return 'SOUTH';
		case Direction.WEST:
			return 'WEST';
		case Direction.NORTH:
			return 'NORTH';
		default:
			throw 'direction is not a valid direction! ' + direction;
		}
	}

	/** Helper method. Returns the angle in degrees given the direction provided. East is always 0 degrees, and goes clockwise.*/
	static angleFromDirection(direction) {
		switch(direction) {
		case Direction.EAST:
			return 0;
		case Direction.SOUTH:
			return 90;
		case Direction.WEST:
			return 180;
		case Direction.NORTH:
			return 270;
		default:
			throw 'direction is not a valid direction! ' + direction;
		}
	}
}

Direction.EAST = 0;
Direction.SOUTH = 1;
Direction.WEST = 2;
Direction.NORTH = 3;