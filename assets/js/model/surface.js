/**
 * surface.js
 *
 * Class representing a surface that a laser can hit.
 */
class Surface {

	constructor(image, type, reflectiveDirection) {
		this.img = image;
		this.type = type || Surface.OPAQUE;
		this.reflectiveDirection = reflectiveDirection || Laser.DIRECTIONS.SOUTH;
	}

	/** Returns a collision point, or null if none exists. */
	getCollisionPoint(point, fromDirection) {
		let extrema = { 
			x: {
				min: this.img.x - this.img.displayWidth / 2,
				max: this.img.x + this.img.displayWidth / 2
			},
			y: {
				min: this.img.y - this.img.displayHeight / 2,
				max: this.img.y + this.img.displayHeight / 2
			}
		};

		switch(fromDirection) {
		case Laser.DIRECTIONS.EAST:
			if (point.x < extrema.x.min && point.y > extrema.y.min && point.y < extrema.y.max) {
				return { x: extrema.x.min, y: point.y };
			}

			break;
		case Laser.DIRECTIONS.SOUTH:
			if (point.y < extrema.y.min && point.x > extrema.x.min && point.x < extrema.x.max) {
				return { x: point.x, y: extrema.y.min };
			}

			break;
		case Laser.DIRECTIONS.WEST:
			if (point.x > extrema.x.max && point.y > extrema.y.min && point.y < extrema.y.max) {
				return { x: extrema.x.max, y: point.y};
			}

			break;
		case Laser.DIRECTIONS.NORTH:
			if (point.y > extrema.y.max && point.x > extrema.x.min && point.x < extrema.x.max) {
				return { x: point.x, y: extrema.y.max };
			}

			break;
		default:
			throw 'Direction "' + fromDirection + '" not valid!'
		}

		return null;
	}

	/** Static helper method. Returns closest surface to the point provided. */
	static closestSurface(point, surface1, surface2) {
		let dist1 = { x: Math.abs(point.x - surface1.img.x), y: Math.abs(point.y - surface1.img.y) }
		let dist2 = { x: Math.abs(point.x - surface2.img.x), y: Math.abs(point.y - surface2.img.y) }

		if (Math.sqrt(dist1.x * dist1.x + dist1.y * dist1.y) < Math.sqrt(dist2.x * dist2.x + dist2.y * dist2.y)) {
			return surface1;
		} else {
			return surface2;
		}
	}
}

Surface.REFLECTIVE = '__reflective__';
Surface.OPAQUE = '__opaque__';