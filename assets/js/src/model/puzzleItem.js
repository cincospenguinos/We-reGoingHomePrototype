/**
 * puzzleItem.js
 *
 * Represents a puzzle item. This is to avoid code duplication.
 */
export class PuzzleItem {

	constructor(opts) {
		if (!opts.position || !opts.dimensions) {
			throw 'PuzzleItem must have starting position and dimensions!';
		}

		this.position = opts.position;
		this.dimensions = opts.dimensions;
	}

	/** Returns the position of this puzzle item. */
	getPosition() {
		return this.img ? { x: this.img.x, y: this.img.y } : this.position;
	}

	/** Returns the dimensions of this puzzle item. */
	getDimensions() {
		return this.img ? { width: this.img.displayWidth, height: this.img.displayHeight } : this.dimensions;
	}

	/** Helper method. Returns the extrema to be used in calculating collision points.*/
	getExtrema() {
		let extrema = { x: {}, y: {} };

		if (this.img) {
			extrema.x.min = this.img.x - this.img.displayWidth / 2;
			extrema.x.max = this.img.x + this.img.displayWidth / 2;
			extrema.y.min = this.img.y - this.img.displayHeight / 2;
			extrema.y.max = this.img.y + this.img.displayHeight / 2
		} else {
			extrema.x.min = this.position.x - this.dimensions.width / 2;
			extrema.x.max = this.position.x + this.dimensions.width / 2;
			extrema.y.min = this.position.y - this.dimensions.height / 2;
			extrema.y.max = this.position.y + this.dimensions.height / 2
		}

		return extrema;
	}
}