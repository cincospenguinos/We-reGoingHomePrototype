/**
 * panel.js
 *
 * Class representing a panel. This refactor is long overdue.
 *
 * TODO: setProperFrame doesn't work. It relies on direction, which isn't good. We should find a new solution.
 */
import { PuzzleItem } from './puzzleItem.js';

export class Panel extends PuzzleItem {

	constructor(opts) {
		super(opts);

		this.hasMouse = false;
	}

	setProperFrame() {
		if (this.img) {
			let frame = this.direction;

			if (this.hasMouse) {
				frame += 4
			}

			this.img.setFrame(frame);
		}
	}

	mouseOver() {
		this.hasMouse = true;
		this.setProperFrame();
	}

	mouseOut() {
		this.hasMouse = false;
		this.setProperFrame();
	}
}