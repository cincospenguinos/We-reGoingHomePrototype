/**
 * puzzleStateFactory.js
 */
export class PuzzleStateFactory {

	constructor() {
		this.current = this.newState();
	}

	/** Add a laser/target pair to state. */
	addStrikingLaser(target, laserKey) {
		if (!this.current.targets[target]) {
			this.current.targets[target] = [];
		}

		this.current.targets[target].push(laserKey);
	}

	/** Removes the laser provided from the state. */
	removeStrikingLaser(laserKey) {
		Object.keys(this.current.targets).forEach((targetKey) => {
			const idx = this.current.targets[targetKey].indexOf(laserKey);

			if (idx > -1) {
				this.current.targets[targetKey].splice(idx, 1);
			}
		})
	}

	/** Sets valid flag in the state. */
	setValid(valid) {
		this.current.valid = valid;
	}

	/** Returns the state as an object. */
	getState() {
		return this.current;
	}

	/** Create new state object to modify. */
	newState() {
		this.current = this._generateNewState();
	}

	/** Static method. Returns difference between two state objects. */
	static diff(previous, current) {
		const diff = { targets: { previous: [], current: [] }, valid: { previous: previous.valid, current: current.valid } };

		// Object.keys(previous.targets).forEach((targetKey) => {
		// 	diff.targets[targetKey].push()
		// });

		return diff;
	}
	/*--PRIVATE */

	/** Helper method. Returns brand new state object to fill. */
	_generateNewState() {
		return { targets: {}, valid: undefined };
	}

}