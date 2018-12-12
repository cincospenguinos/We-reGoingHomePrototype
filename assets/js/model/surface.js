/**
 * surface.js
 *
 * Class representing a surface that a laser can hit.
 */
class Surface {

	constructor(type) {
		this.type = type || Surface.OPAQUE;
	}

	setImg(img) {
		this.img = img;
	}
}

Surface.REFLECTIVE = '__reflective__';
Surface.OPAQUE = '__opaque__';