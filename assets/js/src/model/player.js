/**
 * player.js
 *
 * Class representing the player.
 *
 */
export class Player {
	constructor(opts) {
		this.maxVelocity = opts.maxVelocity || 192;

		this.position = opts.position;
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