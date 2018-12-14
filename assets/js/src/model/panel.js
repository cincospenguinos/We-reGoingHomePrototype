/**
 * panel.js
 *
 * Panel the player interacts with to modify the puzzle.
 */

export class Panel {

	constructor(opts) {
		this.position = opts.position;
		this.dimensions = opts.dimensions;
	}

	getPosition() {
		return this.img ? { x: this.img.x, y: this.img.y } : this.position;
	}
}