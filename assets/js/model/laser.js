/**
 * laser.js
 *
 * Represents a single laser.
 */
class Laser {
	
	constructor(scene) {
		this.scene = scene;

		console.log(this.scene);
	}

	setImg(img) {
		this.img = img;
	}

	/** Returns set of points to draw the laser from. */
	getPath(surfaces) {
		let startingPoint = {x: this.img.x, y: this.img.y};
		let points = [ startingPoint ];
		let currentPoint = startingPoint;

		surfaces.forEach((surface) => {

		});

		if (points.length === 1) {
			points.push({ x: this.scene.game.width, y: startingPoint.y });
		}

		return points;
	}
}