/**
 * laser.js
 *
 * Represents a laser in a puzzle.
 */
import { DIRECTION } from '../../lib/CONST.js';
import { PuzzleItem } from './puzzleItem.js';

export class Laser extends PuzzleItem {
	
	constructor(opts) {
		super(opts);

		this.direction = opts.direction;
		this.movable = opts.movable || false;
	}

	/** Returns the point from which the light of this laser extends. */
	getLaserPoint() {
		let position = this.getPosition();
		let dimensions = this.getDimensions();

		switch(this.direction) {
		case DIRECTION.EAST:
			return { x: position.x + dimensions.width / 2, y: position.y };
		case DIRECTION.SOUTH:
			return { x: position.x, y: position.y + dimensions.height / 2 };
		case DIRECTION.NORTH:
			return { x: position.x, y: position.y - dimensions.height / 2 };
		case DIRECTION.WEST:
			return { x: position.x - dimensions.width / 2, y: position.y };
		default:
			throw 'Direction "' + this.direction + '" is invalid';
		}
	}
}