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
		let points = [currentPoint];

		for (let i = 0; i < this.surfaces.length; i++) {
			let surface = this.surfaces[i];

			if (surface.isInRange(currentPoint)) {
				currentPoint = { x: surface.img.x - surface.img.displayWidth / 2, y: this.laser.img.y };
				points.push(currentPoint);

				if (surface.type === Surface.OPAQUE) {
					break;
				} else {
					i = 0;
				}
			}
		}

		if (points.length === 1) {
			points.push({ x: this.dimensions.width, y: this.laser.img.y });
		}

		return points;
	}
}