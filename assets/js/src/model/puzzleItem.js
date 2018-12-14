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
}