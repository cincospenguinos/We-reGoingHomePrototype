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

	/** Returns true if the laser passing from pt1 to pt2 intersects the player. */
	laserIntersects(pt1, pt2) {
		let isHorizontal = pt1.y === pt2.y ? true : false;
		let position = this.getPosition();
		let dimensions = this.getDimensions();
		let playerBounds = this.getExtrema();

		if (isHorizontal) {
			return Math.abs(pt1.y - position.y) < dimensions.height / 2 
				&& playerBounds.x.min < Math.max(pt1.x, pt2.x)
				&& playerBounds.x.max > Math.min(pt1.x, pt2.x);
		} else {
			return Math.abs(pt1.x - position.x) < dimensions.width / 2
				&& playerBounds.y.min < Math.max(pt1.y, pt2.y)
				&& playerBounds.y.max > Math.min(pt1.y, pt2.y);
		}
	}

	/** Returns the point that this object needs to be set to, or null if no intersection occurs. */
	getLaserRedirectPoint(pt1, pt2) {
		let isHorizontal = pt1.x === pt2.x ? false : true;
		let position = this.getPosition();
		let dimensions = this.getDimensions();
		
		if (isHorizontal) {
			let diff = pt1.y - position.y;

			if (Math.abs(diff) < dimensions.height / 2) {
				return { x: position.x, y: position.y + diff };
			}
		} else {
			let diff = pt1.x - position.x;

			if (Math.abs(diff) < dimensions.width / 2) {
				return { x: position.x + diff, y: position.y };
			}
		}

		return null;
	}

	/** Set the velocity of the player object in the X direction. */
	setVelocityX(velocity) {
		if (!this.img) {
			throw 'There is no image to set the velocity!';
		}

		if (Math.abs(velocity) > this.maxVelocity) {
			velocity < 0 ? velocity = -this.maxVelocity : velocity = maxVelocity;
		}

		this.xVel = velocity;
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

		this.yVel = velocity;
		this.img.setVelocityY(velocity);
	}
}