/**
 * puzzleSolver.js
 *
 * Class that handles solving the puzzle, and indicates changes of state.
 */
import { Target } from '../model/target.js';
import { Direction } from '../model/direction.js';

export class PuzzleSolver {
	constructor(puzzle) {
		this.puzzle = puzzle;

		this.puzzleState = {
			previous: this._newPuzzleState(),
			current: this._newPuzzleState(),
			diff: null,
		};
	}

	/** Solves the puzzle this solver holds. */
	solve() {
		this.puzzleState.previous = this.puzzleState.current;
		this.puzzleState.current = this._newPuzzleState();

		this.puzzle.getLasers().forEach((laser) => {
			this.puzzleState.current.laserPaths[laser.key] = this._determineLaserPath(laser);
		});

		this._trimLaserPaths();

		// 3. Establish which targets are hit by what lasers
		// 4. Manage modification of exits according to targets hit by lasers
		// 5. Check the validity of the puzzle to ensure that it's acceptable
		// 6. Set the puzzle object according to the current state
		this._setPuzzleToCurrentState();

		// TODO: set puzzle state diff here
	}

	puzzleStateCurrent() {
		return this.puzzleState.current;
	}

	/** Returns the changes in puzzle state between the moment before solve() was called and the moment after.
		To be used to help handle things like animations and things. */
	puzzleStateDiff() { // TODO: Calculating state differences?
		return this.puzzleState.diff;
	}

	/*--PRIVATE */

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

				if (closestItem instanceof Target) { this._addStrikingLaserToState(closestItem.key, laser.key); }

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
		Object.keys(this.puzzleState.current.laserPaths).forEach((laser1key) => {
			Object.keys(this.puzzleState.current.laserPaths)
				.filter((k) => k !== laser1key)
				.forEach((laser2key) => {
					let laser1Path = this.puzzleState.current.laserPaths[laser1key];
					let laser2Path = this.puzzleState.current.laserPaths[laser2key];

					const intersection = this._getIntersectionBetween(laser1Path, laser2Path);

					if (intersection) {
						this._removeStrikingLaserFromState(laser1key);
						this._removeStrikingLaserFromState(laser2key);
					}
				});
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

	/** Helper method. Adds striking laser to target in state. */
	_addStrikingLaserToState(targetKey, laserKey) {
		const strikingLasers = this.puzzleState.current.strikingLasers;

		if (!strikingLasers[targetKey]) {
			strikingLasers[targetKey] = [];
		}

		strikingLasers[targetKey].push(laserKey);
	}

	/** Helper method. Removes laser matching key provided from any target in the state. */
	_removeStrikingLaserFromState(laserKey) {
		const strikingLasers = this.puzzleState.current.strikingLasers;
		Object.keys(strikingLasers).forEach((targetKey) => {
			strikingLasers[targetKey] = strikingLasers[targetKey].filter(l => l === laserKey);
		});
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
		Object.keys(this.puzzleState.current.strikingLasers).forEach((targetKey) => {
			this.puzzleState.current.strikingLasers[targetKey].forEach((laserKey) => {
				this.puzzle.addStrikingLaser(laserKey, targetKey);
			});
		});
	}

	_newPuzzleState() {
		return { laserPaths: {}, strikingLasers: {}, valid: false }
	}
}