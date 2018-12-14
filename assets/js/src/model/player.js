/**
 * player.js
 *
 * Class representing the player.
 *
 */
import { PuzzleItem } from './puzzleItem.js';

export class Player extends PuzzleItem {
	constructor(opts) {
		super(opts);
		
		this.maxVelocity = opts.maxVelocity || 192;
	}

	/** Set the velocity of the player object in the X direction. */
	setVelocityX(velocity) {
		if (!this.img) {
			throw 'There is no image to set the velocity!';
		}

		if (Math.abs(velocity) > this.maxVelocity) {
			velocity < 0 ? velocity = -this.maxVelocity : velocity = maxVelocity;
		}

		this.img.setVelocityX(velocity);
	}

	/** Set the velocity of the player object in the Y direction. */
	setVelocityY(velocity) {
		if (!this.img) {
			throw 'There is no player image defined!';
		}

		if (Math.abs(velocity) > this.maxVelocity) {
			velocity < 0 ? velocity = -this.maxVelocity : velocity = maxVelocity;
		}

		this.img.setVelocityY(velocity);
	}
}