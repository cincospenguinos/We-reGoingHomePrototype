/**
 * puzzleSolver.js
 *
 * Class that handles solving the puzzle, and indicates changes of state.
 */
import { PuzzleStateFactory } from './puzzleStateFactory.js';

import { Target } from '../model/target.js';
import { Direction } from '../model/direction.js';

export class PuzzleSolver {
	constructor(puzzle) {
		this.puzzle = puzzle;

		if (!this.puzzle.translation)
			this.puzzle.translation = this._getPuzzleTranslation();

		this.factory = new PuzzleStateFactory();

		this.laserPaths = {};

		this.puzzleState = {
			previous: null,
			current: null,
		};
	}

	/** Solves the puzzle this solver holds. */
	solve() {
		this._newPuzzleState();

		this.puzzle.getLasers().forEach((laser) => {
			this.laserPaths[laser.key] = this._determineLaserPath(laser);
		});

		this._trimLaserPaths();
		this._determinePuzzleValidity();
		this._setPuzzleToCurrentState();
		// this._handleTargetAnimations();
	}

	/** Returns the changes in puzzle state between the moment before solve() was called and the moment after.
		To be used to help handle things like animations and things. */
	puzzleStateDiff() {
		return PuzzleStateFactory.diff(this.puzzleState.previous, this.puzzleState.current);
	}

	/*--PRIVATE */

	/** Helper method. Returns hash indicating how far over and down everything needs to move. */
	_getPuzzleTranslation() {
		let puzzleDim = this.puzzle.dimensions;
		let canvasDim = { width: 800, height: 600 }; // TODO: This should be extracted out to a higher order function

		if (puzzleDim.width > canvasDim.width || puzzleDim.height > canvasDim.height) {
			throw 'Puzzle size invalid for this canvas! Canvas must be larger to accomodate!';
		}

		return { x: (canvasDim.width - puzzleDim.width) / 2, y: (canvasDim.height - puzzleDim.height) / 2 };
	}

	/** Helper method. Returns the laser's path through the puzzle, disregarding other lasers. */
	_determineLaserPath(laser) {
		let terminated = false;
		let currentPoint = laser.getLaserPoint();
		let currentDirection = laser.direction;
		let path = [currentPoint];
		let lastItem = null;

		while(!terminated) {
			const closestItem = this._findClosestItem(currentPoint, currentDirection);

			if (closestItem && closestItem !== lastItem) {
				let collisionPoint = closestItem.getLaserCollisionPoint(currentPoint, currentDirection);
				path.push(collisionPoint);
				lastItem = closestItem;

				if (closestItem instanceof Target) {
					this.factory.addStrikingLaser(closestItem.key, laser); 
				}

				if (closestItem.terminatesLaser || !closestItem.reflectiveDirection(currentDirection)) {
					terminated = true;
				} else {
					currentDirection = closestItem.reflectiveDirection(currentDirection);
					currentPoint = collisionPoint;
				}
			} else {
				break;
			}
		}

		if (!terminated) {
			path.push(this._getWallTerminationPoint(currentPoint, currentDirection));
		}

		return path;
	}

	/** Helper method. Trim the laser's path through the puzzle, ensuring that only like colored lasers may cross. */
	_trimLaserPaths() {
		Object.keys(this.laserPaths).forEach((laser1key) => {
			Object.keys(this.laserPaths)
				.filter((k) => k !== laser1key)
				.forEach((laser2key) => {
					const laser1 = this.puzzle.lasers[laser1key];
					const laser2 = this.puzzle.lasers[laser2key];

					if (laser1.color.key !== laser2.color.key) {
						let laser1Path = this.laserPaths[laser1.key];
						let laser2Path = this.laserPaths[laser2.key];

						const intersection = this._getIntersectionBetween(laser1Path, laser2Path);

						if (intersection) {
							this.factory.removeStrikingLaser(laser1);
							this.factory.removeStrikingLaser(laser2);
						}
					}
				});
		});
	}

	/** Helper method. Determines whether the puzzle is valid or not. */
	_determinePuzzleValidity() {
		this.puzzle.getLasers().forEach((laser) => {
			if (this.puzzle.player) {
				let path = this.laserPaths[laser.key];

				let validity = true;
				for (let i = 0; i < path.length - 1; i++) {
					let line = { x1: path[i].x, y1: path[i].y, x2: path[i + 1].x, y2: path[i + 1].y };
					let playerBounds = this.puzzle.player.getExtrema();

					if (line.y1 === line.y2) { // line is horizontal
						if (line.y1 > playerBounds.y.min && line.y2 < playerBounds.y.max 
							&& this.puzzle.player.getPosition().x < Math.max(line.x1, line.x2)
							&& this.puzzle.player.getPosition().x > Math.min(line.x1, line.x2)) {
							validity = false;
						}
					} else { // line is vertical
						if (line.x1 > playerBounds.x.min && line.x2 < playerBounds.x.max 
							&& this.puzzle.player.getPosition().y < Math.max(line.y1, line.y2)
							&& this.puzzle.player.getPosition().y > Math.min(line.y1, line.y2)) {
							validity = false;
						}
					}
				}

				this.factory.setValid(validity);
			} else {
				this.factory.setValid(true);
			}
		});
	}

	/** Helper method. Returns the closest item in the list that the laser is intersecting, or null if none exists. */
	_findClosestItem(origin, direction) {
		let relevantItems = this.puzzle.getLaserInteractable().filter((s) => s.getLaserCollisionPoint(origin, direction) !== null);

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

	/** Helper method. Returns the termination point on the wall, given an origin point and 
		direction laser is traveling. */
	_getWallTerminationPoint(point, direction) {
		let newPoint = { x: point.x, y: point.y };
		switch(direction) {
		case Direction.EAST:
			newPoint.x = this.puzzle.dimensions.width + this.puzzle.translation.x;
			break;
		case Direction.SOUTH:
			newPoint.y = this.puzzle.dimensions.height + this.puzzle.translation.y;
			break;
		case Direction.WEST:
			newPoint.x = this.puzzle.translation.x;
			break;
		case Direction.NORTH:
			newPoint.y = this.puzzle.translation.y;
			break;
		}
		return newPoint;
	}

	/** Helper method. Returns intersection between the two lasers provided, or null if none exists.*/
	_getIntersectionBetween(path1, path2) {
		let intersection = null;

		this._pathAsLines(path1).forEach((line1) => {
			this._pathAsLines(path2).forEach((line2) => {
				intersection = this._intersectionPointOf(line1, line2);

				if (intersection) {
					return;
				}
			});

			if (intersection) return;
		});

		return intersection;
	}

	/** Helper method. Returns path provided as a collection of lines. */
	_pathAsLines(path) {
		let newPath = [];

		for (let i = 0; i < path.length - 1; i++) {
			newPath.push({ 
				x1: path[i].x, 
				y1: path[i].y, 
				x2: path[i + 1].x, 
				y2: path[i + 1].y,
				isHorizontal: path[i].y === path[i + 1].y
			});
		}

		return newPath;
	}

	/** Helper method. Returns intersection point of the two lines provided, or null if none exists. */
	_intersectionPointOf(line1, line2) {
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

	/** Helper method. Sets the internals of puzzle object to match the current state object. */
	_setPuzzleToCurrentState() {
		this.puzzle.reset();
		this.puzzleState.current = this.factory.getState();

		Object.keys(this.puzzleState.current.targets).forEach((targetKey) => {
			this.puzzleState.current.targets[targetKey].forEach((laser) => {
				this.puzzle.addStrikingLaser(laser.key, targetKey);
			});
		});

		Object.keys(this.laserPaths).forEach((laserKey) => {
			this.puzzle.lasers[laserKey].setPath(this.laserPaths[laserKey]);
		});

		this.puzzle.setValid(this.puzzleState.current.valid);
	}

	/** Helper method. Creates a new puzzle state. */
	_newPuzzleState() {
		this.puzzleState.previous = this.puzzleState.current;
		this.factory.newState();
	}

	/** Helper method. Triggers target animations according to the diff provided. */
	_handleTargetAnimations() {
		const diff = this.puzzleStateDiff();
		this.puzzle.getTargets().forEach((target) => {
			const prevTarget = diff.targets.previous[target.key];
			const currentTarget = diff.targets.current[target.key];

			if (prevTarget && currentTarget) {
				const targetTurnedOn = (prevTarget.length === 0 && currentTarget.length > 0);
				const targetTurnedOff = (prevTarget.length > 0 && currentTarget.length === 0);

				if (targetTurnedOn) {
					target.turnedOn(this.scene);
					this.puzzle.getExits()
						.filter(e => e.color.key === currentTarget[0])
						.forEach((exit) => {
							exit.triggerAnimation();
						});
				} else if (targetTurnedOff) {
					target.turnedOff(this.scene);
					this.puzzle.getExits()
						.forEach((exit) => {
							exit.triggerAnimation();
						});
				} else if (prevTarget.length === currentTarget.length) {
					prevTarget.forEach((color) => {
						if (currentTarget.indexOf(color) === -1) {
							// TODO: Get the proper colored animation up and running here
							console.log('target changed color');
						}
					});
				}
			}
		});
	}
}