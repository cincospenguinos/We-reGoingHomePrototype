/**
 * target.js
 *
 * A target that causes something to occur in a game.
 *
 * TODO: Override getCollisionPoint() here for better looking sprite work
 */
import { PuzzleItem } from './puzzleItem.js';

export class Target extends PuzzleItem {
	constructor(opts) {
		super(opts);

		this.key = opts.key;
		this.lasersStruck = [];
		this.terminatesLaser = true;
		this.laserInteractable = true;

		if (!this.key) {
			throw 'A key is necessary to instantiate a target!';
		}
	}

	/** Helper method. Manages sprites of this target. */
	pointerOver() {
		if (this.img) {
			let frame = 0;

			if (this.movable) frame += 1;
			if (this.rotatable) frame += 2;
			if (this.isLit()) frame += 4;

			this.img.setFrame(frame);
		}
	}

	/** Helper method. Manages sprites of this target. */
	pointerOut() {
		if (this.img) {
			this.isLit() ? this.img.setFrame(4) : this.img.setFrame(0);
		}
	}

	/** Adds laser that strikes the key provided to the collection of lasers hitting this target. */
	addStrikingLaser(color) {
		this.lasersStruck.push(color.key);

		if (this.img) {
			this.img.setFrame(this.img.frame.name + 4);
		}
	}

	/** Removes the striking laser provided. */
	removeStrikingLaser(color) {
		this.lasersStruck.remove(color.key);

		if (this.img && !this.isLit()) {
			this.img.setFrame(this.img.frame.name - 4);	
		}
	}

	/** Returns true if this target is being struck by the laser matching the key provided. */
	isStruckBy(color) {
		return this.lasersStruck.includes(color.key);
	}

	/** Resets the lasers that were striking this target. */
	resetStrikingLasers() {
		this.lasersStruck = [];

		if (this.img && this.img.frame.name >= 4) {
			this.img.setFrame(this.img.frame.name - 4);
		}
	}

	/** Returns true if this target is getting hit by at least one laser. */
	isLit() {
		return this.lasersStruck.length >= 1;
	}
}