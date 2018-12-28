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
			throw 'A target key is required to instantiate a target';
		}
	}

	/** Helper method. Manages sprites of this target. */
	pointerOver() {
		if (this.img) {
			let frame = 0;

			if (this.movable && this.rotatable) {
				frame = 3;
			} else if (this.movable) {
				frame = 1;
			} else if (this.rotatable) {
				frame = 2;
			}

			if (this.isLit()) {
				frame += 4;
			}

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
	addStrikingLaser(laserKey) {
		this.lasersStruck.push(laserKey);

		if (this.img) {
			this.img.setFrame(this.img.frame.name + 4);
		}
	}

	/** Removes the striking laser provided. */
	removeStrikingLaser(laserKey) {
		this.lasersStruck.remove(laserKey);

		if (this.img && !this.isLit()) {
			this.img.setFrame(this.img.frame.name - 4);	
		}
	}

	/** Returns true if this target is being struck by the laser matching the key provided. */
	isStruckBy(laserKey) {
		return this.lasersStruck.includes(laserKey);
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