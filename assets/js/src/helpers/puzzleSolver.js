/**
 * puzzleSolver.js
 *
 * Class that handles solving the puzzle, and indicates changes of state.
 */
import { Target } from '../model/target.js';

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

		// 2. Calculate the trimmed path of each laser
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

	/** Helper method. Adds striking laser to target in state. */
	_addStrikingLaserToState(targetKey, laserKey) {
		const strikingLasers = this.puzzleState.current.strikingLasers;

		if (!strikingLasers[targetKey]) {
			strikingLasers[targetKey] = [];
		}

		strikingLasers[targetKey].push(laserKey);
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