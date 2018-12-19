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
		this.dimensions = opts.dimensions;
		this.key = opts.key;
		this.roomKey = opts.roomKey;

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
			let lastItem = null;

			// Get the closest item
			while(!terminated) {
				let closestItem = this.findClosestItem(interactable, currentPoint, currentDirection);

				if (closestItem && closestItem !== lastItem) {
					let collisionPoint = closestItem.getLaserCollisionPoint(currentPoint, currentDirection);
					path.push(collisionPoint);
					lastItem = closestItem;

					// Now that we know that the laser hits this item, we can handle it as we need to
					if (closestItem instanceof Target) {
						closestItem.addStrikingLaser(laser.key);

						// Since an exit is tied to a laser rather than a target, we find the exit
						// that is tied to this laser and set it to be open.
						this.exitsConnectedTo(laser).forEach((exit) => { exit.isOpen = true });
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
		this.getExits().forEach((exit) => { exit.isOpen = false; });
		this.getTargets().forEach((target) => { target.resetStrikingLasers(); });
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
		return this.getLasers().concat(this.getSurfaces(), this.getTargets()).filter((i) => i.laserInteractable);
	}

	/** Helper method. Returns the lasers as an array. */
	getLasers() {
		return Object.keys(this.lasers).map((lKey) => { return this.lasers[lKey] });
	}

	/** Helper method. Returns array of targets. */
	getTargets() {
		return Object.keys(this.targets).map((tKey) => { return this.targets[tKey] });
	}

	/** Helper method. Returns array of surfaces. */
	getSurfaces() {
		return Object.keys(this.surfaces).map((sKey) => { return this.surfaces[sKey] });
	}

	/** Helper method. Returns array of exits. */
	getExits() {
		return Object.keys(this.exits).map((eKey) => { return this.exits[eKey] });
	}

	/** Helper method. Returns the exits that are connected to the laser provided. */
	exitsConnectedTo(laser) {
		return this.getExits().filter((exit) => { return laser.exitKeys.includes(exit.key) });
	}
}