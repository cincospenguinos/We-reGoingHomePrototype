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
import { Player } from './player.js';

export class Puzzle {

	constructor(opts) {
		this.dimensions = opts.dimensions;
		this.key = opts.key;
		this.roomKey = opts.roomKey;
		this.mapName = opts.mapName;
		this.thoughts = opts.thoughts || [];

		this.targets = {};
		this.surfaces = [];
		this.panels = [];
		this.exits = {};
		this.lasers = {};
		this.valid = true;

		if (!this.key || !this.roomKey || !this.mapName) {
			throw 'Every Puzzle requires a key, a room key, and a map name!'
		}
	}

	/** Solves the puzzle. Sets up the solution variables of the various pieces according to its current state. Optional
		parameter for calculating laser paths in the puzzle scene included.*/
	solve() {
		this.resetSolution();

		let interactable = this.getLaserInteractable();

		// 1) Calculate the full path of every laser and assign it to the laser itself
		let targetLaserPairs = {};
		this.getLasers().forEach((laser) => {
			let pathInfo = this._generateLaserPath(laser);
			Object.keys(pathInfo.pairs).forEach((targetKey) => {
				const incomingLaserArray = pathInfo.pairs[targetKey];
				let resultingArray = targetLaserPairs[targetKey];

				if (targetLaserPairs[targetKey]) {
					resultingArray = resultingArray.concat(incomingLaserArray);
				} else {
					resultingArray = incomingLaserArray;
				}
				
				targetLaserPairs[targetKey] = resultingArray;
			});
			laser.setPath(pathInfo.path);
		});

		// 2) Calculate the trimmed paths of the lasers, using every other laser's path
		this.getLasers().forEach((laser1) => {
			this.getLasers().filter((l) => { return l !== laser1 && l.color !== laser1.color }).forEach((laser2) => {
				let foundIntersection = false;

				laser1.getPathAsLines().forEach((laser1Line) => {
					laser2.getPathAsLines().forEach((laser2Line) => {
						// Now that we have the cross-product from hell between laser 1 path and laser 2 path, let's
						// see if any line intersects another line
						let intersection = this.intersectionPointOf(laser1Line, laser2Line);

						if (intersection) {
							laser1.path = laser1.path.slice(laser1.getPathAsLines().indexOf(laser1Line));
							laser2.path = laser2.path.slice(laser2.getPathAsLines().indexOf(laser2Line));
							laser1.path.push(intersection);
							laser2.path.push(intersection);

							// Since we know that neither of these lasers are hitting a target, let's remove
							// them from the set of targets we have
							Object.keys(targetLaserPairs).forEach((tKey) => {
								let idx = targetLaserPairs[tKey].indexOf(laser1.key);

								if (idx > -1) {
									targetLaserPairs[tKey].splice(idx, 1);
								}

								idx = targetLaserPairs[tKey].indexOf(laser2.key);

								if (idx > -1) {
									targetLaserPairs[tKey].splice(idx, 1);
								}
							});

							foundIntersection = true;
							return false; // NOTE: This is "break" since we are in a function
						}
					});

					if (foundIntersection) {
						return false; // NOTE: This is "break" since we are in a function
					}
				});
			});
		});

		// 3) Figure out which targets are still struck by what lasers with the new paths
		Object.keys(targetLaserPairs).forEach((tKey) => {
			let laserColors = targetLaserPairs[tKey].map((lKey) => { return this.lasers[lKey].color });
			laserColors.forEach((color) => { this.targets[tKey].addStrikingLaser(color) });
		});

		// Handle opening the exits if the proper color is hitting the target.
		this.getTargets().forEach((t) => {
			this.exitsConnectedTo(t.color).forEach((exit) => {
				exit.setOpen(true);
			});
		});

		// Make sure the proper frame is shown for an exit
		this.getExits().forEach((exit) => { exit.setProperFrame(); });

		// 4) Check each laser's new path and ensure that none of them strike the player
		this.getLasers().forEach((laser) => {
			if (this.player && this.valid) {
				let path = laser.path;
				let validity = true;
				for (let i = 0; i < path.length - 1; i++) {
					let line = { x1: path[i].x, y1: path[i].y, x2: path[i + 1].x, y2: path[i + 1].y };
					let playerBounds = this.player.getExtrema();

					if (line.y1 === line.y2) { // line is horizontal
						if (line.y1 > playerBounds.y.min && line.y2 < playerBounds.y.max 
							&& this.player.getPosition().x < Math.max(line.x1, line.x2)
							&& this.player.getPosition().x > Math.min(line.x1, line.x2)) {
							validity = false;
						}
					} else { // line is vertical
						if (line.x1 > playerBounds.x.min && line.x2 < playerBounds.x.max 
							&& this.player.getPosition().y < Math.max(line.y1, line.y2)
							&& this.player.getPosition().y > Math.min(line.y1, line.y2)) {
							validity = false;
						}
					}
				}

				if (!validity) {
					this.valid = validity;
				}
			}
		});

		return this.valid;
	}

	/** Helper method. Resets the various state variables so that they can be properly set by solve() */
	reset() {
		this.getExits().forEach((exit) => { exit.reset(); });
		this.getTargets().forEach((target) => { target.resetStrikingLasers(); });
		this.valid = null;
	}

	/** Helper method. To ensure that no weird bugs with position occur switching between scenes, 
		this will reset images of the various pieces. */
	resetImgs() {
		this.getExits().forEach((i) => { i.img = null; });
		this.getLasers().forEach((i) => { i.resetImg(); });
		this.getTargets().forEach((i) => { i.resetImg(); });
		this.getLaserInteractable().forEach((i) => { i.resetImg(); });
	}

	/** Add surface to the puzzle. */
	addSurface(surface) {
		surface instanceof Surface ? this.surfaces.push(surface) : (() => { throw 'surface must be an instance of Surface!'});
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

	/** Adds a striking laser to the target. */
	addStrikingLaser(laserKey, targetKey) {
		if (!this.lasers[laserKey] || !this.targets[targetKey]) {
			throw `Cannot find target or laser! ${laserKey} || ${targetKey}`;
		}

		this.targets[targetKey].addStrikingLaser(this.lasers[laserKey].color);
		this.getTargets().forEach((target) => {
			this.getExits().forEach((exit) => {
				exit.colorStruck(target.color);
			});
		});
	}

	setPlayer(player) {
		if (!(player instanceof Player)) {
			throw 'Player provided is not a Player object!';
		}

		this.player = player;
	}

	setTranslation(translation) {
		this.translation = translation;
	}

	/*--PRIVATE */

	/** Helper method. Generates the path of the laser provided, along with all of the targets that are struck by a laser. */
	_generateLaserPath(laser) {
		let interactable = this.getLaserInteractable(); // All laser interactable objects
		let currentPoint = laser.getLaserPoint(); // Current point we're looking at
		let currentDirection = laser.direction; // Current direction the laser is facing
		let path = [currentPoint]; // The path we will assign to our laser
		let terminated = false; // Whether or not the laser's path terminated by hitting a surface or other colored laser
		let lastItem = null;
		let pairs = {};

		// Get the closest item
		while(!terminated) {
			let closestItem = this._findClosestItem(interactable, currentPoint, currentDirection);

			if (closestItem && closestItem !== lastItem) {
				let collisionPoint = closestItem.getLaserCollisionPoint(currentPoint, currentDirection);
				path.push(collisionPoint);
				lastItem = closestItem;

				// Now that we know that the laser hits this item, we can handle it as we need to
				if (closestItem instanceof Target) {

					// Add this laser to the laser target pairs
					if (!pairs[closestItem.key]) {
						pairs[closestItem.key] = [];
					}

					pairs[closestItem.key].push(laser.key);
				} 

				// Now we check our cases. If what we have terminates the laser, then terminate it. If it
				// doesn't, then check if it's reflective and whether or not it reflects. If it isn't
				// reflective, then we keep on truckin'
				if (closestItem.terminatesLaser) {
					terminated = true;
				} else if (closestItem.type === Surface.REFLECTIVE) {
					currentDirection = closestItem.reflectiveDirection(currentDirection);

					if (!currentDirection) {
						terminated = true;
					} else {
						currentPoint = collisionPoint;
					}
				} else {
					currentPoint = collisionPoint;
					currentDirection = closestItem.direction;
				}
			} else {
				break;
			}
		}

		// Handle final point of non-terminated laser
		if (!terminated) { path.push(this._getWallTerminationPoint(currentPoint, currentDirection)); }

		return { path: path, pairs: pairs };
	}

	/** Helper method. Returns the point of termination on the wall of a room or puzzle, given the previous point
		and the direction the laser is traveling. To be used in calculating a laser's path. */
	_getWallTerminationPoint(point, direction) {
		let newPoint = { x: point.x, y: point.y };
		switch(direction) {
		case Direction.EAST:
			newPoint.x = this.dimensions.width + this.translation.x;
			break;
		case Direction.SOUTH:
			newPoint.y = this.dimensions.height + this.translation.y;
			break;
		case Direction.WEST:
			newPoint.x = this.translation.x;
			break;
		case Direction.NORTH:
			newPoint.y = this.translation.y;
			break;
		}
		return newPoint;
	}

	/** Helper method. Returns the closest item in the list that the laser is intersecting, or null if none exists. */
	_findClosestItem(items, origin, direction) {
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
		return this.getLasers().concat(this.surfaces, this.getTargets()).filter((i) => i.laserInteractable);
	}

	/** Helper method. Returns the lasers as an array. */
	getLasers() {
		return Object.keys(this.lasers).map((lKey) => { return this.lasers[lKey] });
	}

	/** Helper method. Returns array of targets. */
	getTargets() {
		return Object.keys(this.targets).map((tKey) => { return this.targets[tKey] });
	}

	/** Helper method. Returns array of exits. */
	getExits() {
		return Object.keys(this.exits).map((eKey) => { return this.exits[eKey] });
	}

	/** Helper method. Returns all items in the puzzle. */
	getAllItems() {
		return this.getLasers().concat(this.surfaces, this.getTargets(), this.getExits(), this.panels);
	}

	/** Helper method. Returns the exits that are connected to the laser provided. */
	exitsConnectedTo(color) {
		return this.getExits().filter((exit) => { return color === exit.color });
	}

	/** Helper method. Returns intersection point if two lines intersect, or null if they do not. */
	intersectionPointOf(line1, line2) {
		let line1Horizontal = (line1.y1 === line1.y2);
		let line2Horizontal = (line2.y1 === line2.y2);

		// First case: both lines face the same direction
		if ((line1Horizontal && line2Horizontal) || (!line1Horizontal && !line2Horizontal)) {
			if (line1Horizontal) {
				if ((line1.x1 <= Math.max(line2.x1, line2.x2) && line1.x1 >= Math.min(line2.x1, line2.x2)) ||
					(line1.x2 <= Math.max(line2.x1, line2.x2) && line1.x2 >= Math.min(line2.x1, line2.x2))) {
					// This is just the mid-point of all of their mins/maxes
					let x1 = Math.min(line1.x1, line1.x2, line2.x1, line2.x2);
					let x2 = Math.max(line1.x1, line1.x2, line2.x1, line2.x2);

					return { x: (x2 + x1) / 2, y: line1.y1 }
				}
			} else {
				if ((line1.y1 <= Math.max(line2.y1, line2.y2) && line1.y1 >= Math.min(line2.y1, line2.y2)) ||
					(line1.y2 <= Math.max(line2.y1, line2.y2) && line1.y2 >= Math.min(line2.y1, line2.y2))) {
					let y1 = Math.min(line1.y1, line1.y2, line2.y1, line2.y2);
					let y2 = Math.min(line1.y1, line1.y2, line2.y1, line2.y2);

					return { x: line1.x1, y: (y1 + y2) / 2 };
				}
			}
		} else { // Second case: both lines are opposite directions
			if (line1Horizontal) {
				let betweenLine = (line2.x1 <= Math.max(line1.x1, line1.x2) && line2.x1 >= Math.min(line1.x1, line1.x2));

				if (Math.min(line2.y1, line2.y2) <= line1.y1 && Math.max(line2.y1, line2.y2) >= line1.y1) {
					return { x: line2.x1, y: line1.y1 };
				}
			} else {
				let betweenLine = (line1.x1 <= Math.max(line2.x1, line2.x2) && line1.x1 >= Math.min(line2.x1, line2.x2));

				if (Math.min(line1.y1, line1.y2) <= line2.y1 && Math.max(line1.y1, line1.y2) >= line2.y1) {
					return { x: line1.x1, y: line2.y1 };
				}
			}
		}

		return null;
	}
}