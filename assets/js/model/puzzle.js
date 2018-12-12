/**
 * puzzle.js
 *
 * Represents a puzzle.
 *
 */
class Puzzle {

	constructor(width, height) {
		this.dimensions = { width: width, height: height };

		this.surfaces = [];
	}

	/** Adds the surface provided to the set. */
	addSurface(surface, type) {
		surface = new Surface(surface, type);
		this.surfaces.push(surface);
	}

	/** Returns the various points the laser passes through. To be used by graphics to draw laser. */
	getLaserPath() {
		if (!this.laser) {
			throw 'Laser must be defined in puzzle before attempting to calculate a path';
		}

		let currentPoint = { x: this.laser.img.x + this.laser.img.displayWidth / 2, y: this.laser.img.y };
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
			case Laser.DIRECTIONS.EAST:
				points.push({ x: currentPoint.x + this.dimensions.width, y: currentPoint.y });
				break;
			case Laser.DIRECTIONS.SOUTH:
				points.push({ x: currentPoint.x, y: currentPoint.y + this.dimensions.height });
				break;
			case Laser.DIRECTIONS.WEST:
				points.push({ x: currentPoint.x - this.dimensions.width, y: currentPoint.y });
				break;
			case Laser.DIRECTIONS.NORTH:
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