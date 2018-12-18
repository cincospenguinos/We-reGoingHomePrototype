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
		this.laserKey = opts.laserKey;
		this.exitKey = opts.exitKey;

		this.lasersStruck = [];
		this.terminatesLaser = true;

		if (!this.key || !this.laserKey || !this.exitKey) {
			throw 'A target key, laser key, and exit key are required to instantiate a target';
		}
	}

	/** Adds laser that strikes the key provided to the collection of lasers hitting this target. */
	addStrikingLaser(laserKey) {
		this.lasersStruck.push(laserKey);
	}

	/** Removes the striking laser provided. */
	removeStrikingLaser(laserKey) {
		this.lasersStruck.remove(laserKey);
	}

	/** Returns true if this target is being struck by the laser matching the key provided. */
	isStruckBy(laserKey) {
		return this.lasersStruck.includes(laserKey);
	}

	/** Resets the lasers that were striking this target. */
	resetStrikingLasers() {
		this.lasersStruck.length = 0;
	}

	/** Returns true if this target is getting hit by at least one laser. */
	isLit() {
		return this.lasersStruck.length > 0;
	}
}