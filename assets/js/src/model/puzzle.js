/**
 * puzzle.js
 *
 * Represents a puzzle.
 *
 */
import { Surface } from './surface.js';
import { Laser } from './laser.js';
import { PuzzleItem } from './puzzleItem.js';
import { Exit } from './exit.js';
import { Direction } from './direction.js';
import { Target } from './target.js';

export class Puzzle {

	constructor(opts) {
		this.dimensions = opts.key;
		this.key = opts.key;
		this.roomKey = opts.key;

		this.targets = {};
		this.surfaces = {};
		this.panels = [];
		this.exits = {};
		this.lasers = {};
		this.solved = false;

		if (!this.key || !this.roomKey) {
			throw 'Every Puzzle requires a key and must belong to a room!'
		}
	}

	/** Add surface to the puzzle. */
	addSurface(surface) {
		surface instanceof Surface ? this.surfaces[surface.key] = surface : (() => { throw 'surface must be an instance of Surface!'});
	}

	/** Adds the exit provided to the puzzle. */
	addExit(exit) {
		exit instanceof Exit ? this.exits[exit.key] = exit : (() => { throw 'exit must ben an instance of Exit!'});
	}

	/** Adds the laser provided. */
	addLaser(laser) {
		laser instanceof Laser ? this.lasers[laser.key] = laser : (() => { throw 'laser must be an instance of Laser!' });
	}

	/** Adds the target provided. */
	addTarget(target) {
		target instanceof Target ? this.targets[target.key] = target : (() => { throw 'target must be an instance of Target!' });
	}

	/** Adds the panel provided to the puzzle. */
	addPanel(panel) {
		panel instanceof PuzzleItem ? this.panels.push(panel) : (() => { throw 'panel must be an instance of Panel!'});
	}

	/** Solves the puzzle. Sets up the solution variables of the various pieces according to its current state. */
	solve() {
		this.resetSolution();

		let interactable = this.getLaserInteractable();

		// Since there is a path for each laser, we must generate a path and assign it to each laser
		this.getLasers().forEach((laser) => {
			let currentPoint = laser.getLaserPoint(); // Current point we're looking at
			let currentDirection = laser.direction; // Current direction the laser is facing
			let path = [currentPoint]; // The path we will assign to our laser
			let terminated = false; // Whether or not the laser's path terminated by hitting a surface

			// Get the closest item
			while(!terminated) {
				let closestItem = this.findClosestItem(interactable, currentPoint, currentDirection);

				if (closestItem) {
					let collisionPoint = closestItem.getLaserCollisionPoint(currentPoint, currentDirection);
					path.push(collisionPoint);

					// Now that we know that the laser hits this item, we can handle it as we need to
					if (closestItem instanceof Target) {
						closestItem.addStrikingLaser(laser.key);
						this.exits[closestItem.exitKey].isOpen = true;
					}

					if (closestItem.terminatesLaser) {
						terminated = true;
					} else {
						currentPoint = collisionPoint;
						currentDirection = closestItem.direction;
					}
				} else {
					break;
				}
			}

			if (!terminated) {
				let newPoint = { x: currentPoint.x, y: currentPoint.y };
				switch(currentDirection) {
				case Direction.EAST:
					newPoint.x = this.dimensions.width;
					break;
				case Direction.SOUTH:
					newPoint.y = this.dimensions.height;
					break;
				case Direction.WEST:
					newPoint.x = 0;
					break;
				case Direction.NORTH:
					newPoint.y = 0;
					break;
				}
				path.push(newPoint);
			}

			laser.path = path;
		});
	}

	/** Helper method. Resets the various state variables so that they can be properly set by solve() */
	resetSolution() {
		Object.keys(this.exits).map((key) => { return this.exits[key] }).forEach((exit) => { exit.isOpen = false; });
		Object.keys(this.targets).map((key) => { return this.targets[key] }).forEach((target) => { target.resetStrikingLasers(); });
	}

	getLaserPath(laserKey) {
		let laser = this.lasers[laserKey];

		if (!laser) {
			throw 'No laser matching "' + laserKey + '" found!';
		}
	}

	/** Returns the target surface in the set of surfaces. */
	getTargetSurface() {
		return this.surfaces.filter((s) => s.isTarget)[0];
	}

	/** Helper method. Returns the closest item in the list that the laser is intersecting, or null if none exists. */
	findClosestItem(items, origin, direction) {
		let relevantItems = items.filter((s) => s.getLaserCollisionPoint(origin, direction) !== null);

		if (relevantItems.length === 1) {
			return relevantItems[0];
		} else if (relevantItems.length > 1) {
			let closestItem = relevantItems[0];
			for (let i = 1; i < closestItem.length; i++) {
				closestItem = PuzzleItem.closestItem(closestItem, relevantItems[i]);
			}
			return closestItem;
		} else {
			return null;
		}
	}

	/** Helper method. Returns all PuzzleItems that are interactable with a laser. */
	getLaserInteractable() {
		let surfaces = Object.keys(this.surfaces).map((sKey) => { return this.surfaces[sKey] });
		let lasers = Object.keys(this.lasers).map((lKey) => { return this.lasers[lKey] });
		let targets = Object.keys(this.targets).map((tKey) => { return this.targets[tKey] });

		return surfaces.concat(lasers, targets).filter((i) => i.laserInteractable);
	}

	/** Helper method. Returns the lasers as an array. */
	getLasers() {
		return Object.keys(this.lasers).map((lKey) => { return this.lasers[lKey] });
	}
}