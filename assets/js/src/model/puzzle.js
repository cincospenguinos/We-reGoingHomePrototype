/**
 * puzzle.js
 *
 * Represents a puzzle.
 *
 */
import { Surface } from './surface.js';
import { Laser } from './laser.js';
import { DIRECTION } from '../../lib/CONST.js';

export class Puzzle {

	constructor(width, height) {
		this.dimensions = { width: width, height: height };

		this.surfaces = [];
		this.complete = false;
	}

	/** Add surface to the puzzle. */
	addSurface(surface) {
		if (surface instanceof Surface) {
			this.surfaces.push(surface);
		} else {
			throw 'Expected "' + surface + '" to be a surface object';
		}
	}

	/** Returns the various points the laser passes through. To be used by graphics to draw laser. */
	getLaserPath() {
		if (!this.laser) {
			throw 'Laser must be defined in puzzle before attempting to calculate a path';
		}

		let currentPoint = this.laser.getLaserPoint();
		let currentDirection = this.laser.direction;
		let points = [currentPoint];

		let closestSurface;
		let terminated = false;

		do {
			closestSurface = null;
			this.getSurfacesInRange(currentPoint, currentDirection).forEach((s) => {
				!closestSurface ? closestSurface = s : closestSurface = Surface.closestSurface(currentPoint, closestSurface, s);
			});

			if (closestSurface) {
				let newPoint = closestSurface.getCollisionPoint(currentPoint, currentDirection);
				points.push(newPoint);
				currentPoint = newPoint;

				if (closestSurface.isTarget) {
					this.complete = true;
				}

				if (closestSurface.type === Surface.OPAQUE) {
					terminated = true;
					break;
				} else {
					currentDirection = closestSurface.reflectiveDirection;
				}
			} else {
				break;
			}
		} while (closestSurface)

		if (points.length === 1 || !terminated) {
			switch(currentDirection) {
			case DIRECTION.EAST:
				points.push({ x: currentPoint.x + this.dimensions.width, y: currentPoint.y });
				break;
			case DIRECTION.SOUTH:
				points.push({ x: currentPoint.x, y: currentPoint.y + this.dimensions.height });
				break;
			case DIRECTION.WEST:
				points.push({ x: currentPoint.x - this.dimensions.width, y: currentPoint.y });
				break;
			case DIRECTION.NORTH:
				points.push({ x: currentPoint.x, y: currentPoint.y - this.dimensions.height });
				break;
			}
		}

		return points;
	}

	/** Helper method. Returns all of the surfaces in range. */
	getSurfacesInRange(currentPoint, currentDirection) {
		return this.surfaces.filter((s) => s.getCollisionPoint(currentPoint, currentDirection) !== null);
	}
}