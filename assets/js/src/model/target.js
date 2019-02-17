/**
 * target.js
 *
 * A target that causes something to occur in a game.
 *
 * TODO: Override getCollisionPoint() here for better looking sprite work
 */
import { PuzzleItem } from './puzzleItem.js';
import { LaserColor } from './laserColor.js';

export class Target extends PuzzleItem {
	constructor(opts) {
		super(opts);

		this.key = opts.key;
		this.lasersStruck = [];
		this.terminatesLaser = true;
		this.laserInteractable = true;
		this.color = opts.color || null;

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
		this.color = LaserColor.blend(this.laserColorsStruck());
		// this.setProperFrame();
	}

	/** Removes the striking laser provided. */
	removeStrikingLaser(color) {
		this.lasersStruck.remove(color.key);

		if (this.isLit()) {
			this.color = LaserColor.blend(this.laserColorsStruck());
		}

		// this.setProperFrame();
	}

	/** Overrides super. Ensures proper frame. */
	setImg(img) {
		this.img = img;
		// this.setProperFrame();
	}

	/** Returns true if this target is being struck by the laser matching the key provided. */
	isStruckBy(color) {
		return this.lasersStruck.includes(color.key);
	}

	setProperFrame() {
		if (this.img) {
			if (this.isLit()) {
				switch(this.color.key) {
				case LaserColor.RED.key:
					this.img.setFrame(1);
					break;
				case LaserColor.GREEN.key:
					this.img.setFrame(2);
					break;
				case LaserColor.BLUE.key:
					this.img.setFrame(3);
					break;
				case LaserColor.ORANGE.key:
				case LaserColor.PURPLE.key:
				case LaserColor.YELLOW.key:
				case LaserColor.WHITE.key:
					throw 'No frame for "' + this.color.key + '"!';
				}
			} else {
				this.img.setFrame(0);
			}
		}
	}

	/** Resets the lasers that were striking this target. */
	resetStrikingLasers() {
		this.lasersStruck = [];
		this.color = null;
		// this.setProperFrame();
	}

	/** Helper method. Returns the literal laser colors striking this target.*/
	laserColorsStruck() {
		return this.lasersStruck.map((key) => { return LaserColor.colorFromKey(key) });
	}

	/** Returns true if this target is getting hit by at least one laser, or if the color is set. */
	isLit() {
		return this.lasersStruck.length >= 1 || this.color;
	}
}