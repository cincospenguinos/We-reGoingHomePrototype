/**
 * laser.js
 *
 * Represents a laser in a puzzle.
 */
import { Direction } from './direction.js';
import { PuzzleItem } from './puzzleItem.js';
import { LaserColor } from './laserColor.js';

export class Laser extends PuzzleItem {
	
	constructor(opts) {
		super(opts);

		this.key = opts.key;
		this.color = opts.color;
		this.terminatesLaser = true;

		if (!this.key || !this.color || !(this.color instanceof LaserColor) || !Direction.validDirection(this.direction)) {
			throw 'A laser color, key, and valid direction are necessary to instantiate a Laser!';
		}
	}

	/** Sets the img to the img provided. */
	setImg(img) {
		super.setImg(img);

		let angle = Direction.angleFromDirection(this.direction);
		this.img.setAngle(angle);
	}

	/** Returns the point from which the light of this laser extends. */
	getLaserPoint() {
		let position = this.getPosition();
		let dimensions = this.getDimensions();

		switch(this.direction) {
		case Direction.EAST:
			return { x: position.x + dimensions.width / 2, y: position.y };
		case Direction.SOUTH:
			return { x: position.x, y: position.y + dimensions.height / 2 };
		case Direction.NORTH:
			return { x: position.x, y: position.y - dimensions.height / 2 };
		case Direction.WEST:
			return { x: position.x - dimensions.width / 2, y: position.y };
		default:
			throw 'Direction "' + this.direction + '" is invalid';
		}
	}

	/** Helper method. Returns the path of this laser as a set of "line" hashes. */
	getPathAsLines() {
		if (this.path) {
			let newPath = [];

			for (let i = 0; i < this.path.length - 1; i++) {
				newPath.push({ x1: this.path[i].x, y1: this.path[i].y, x2: this.path[i + 1].x, y2: this.path[i + 1].y });
			}

			return newPath;
		} else {
			throw 'No path assigned!';
		}
	}
}