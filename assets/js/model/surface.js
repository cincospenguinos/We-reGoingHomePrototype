/**
 * surface.js
 *
 * Class representing a surface that a laser can hit.
 */
class Surface {

	constructor(image, type) {
		this.img = image;
		this.type = type || Surface.OPAQUE;
	}

	/** Returns true if the point provided is in range. */
	isInRange(point) {
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

		return point.y > extrema.y.min && point.y < extrema.y.max;
	}
}

Surface.REFLECTIVE = '__reflective__';
Surface.OPAQUE = '__opaque__';