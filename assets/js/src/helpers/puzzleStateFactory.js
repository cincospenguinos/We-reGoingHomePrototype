/**
 * puzzleStateFactory.js
 */
export class PuzzleStateFactory {

	constructor() {
		this.current = this.newState();
	}

	/** Add a laser/target pair to state. */
	addStrikingLaser(target, laser) {
		if (!this.current.targets[target]) {
			this.current.targets[target] = [];
		}

		this.current.targets[target].push(laser);
	}

	/** Removes the laser provided from the state. */
	removeStrikingLaser(laser) {
		Object.keys(this.current.targets).forEach((targetKey) => {
			const idx = this.current.targets[targetKey].indexOf(laser);

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
		// TODO: Modify this?
		return this.current;
	}

	/** Create new state object to modify. */
	newState() {
		this.current = this._generateNewState();
	}

	/** Static method. Returns difference between two state objects. */
	static diff(previous, current) {
		const diff = { 
			targets: { 
				previous: {}, 
				current: {},
			}, 
			valid: { 
				previous: previous.valid, 
				current: current.valid 
			},
		};

		Object.keys(previous.targets).forEach((targetKey) => {
			const lasers = previous.targets[targetKey];

			if (!diff.targets.previous[targetKey]) {
				diff.targets.previous[targetKey] = [];
			}

			lasers.forEach((laser) => {
				if (diff.targets.previous[targetKey].indexOf(laser.color.key) === -1) {
					diff.targets.previous[targetKey].push(laser.color.key);
				}
			});
		});

		Object.keys(current.targets).forEach((targetKey) => {
			const lasers = current.targets[targetKey];

			if (!diff.targets.current[targetKey]) {
				diff.targets.current[targetKey] = [];
			}

			lasers.forEach((laser) => {
				if (diff.targets.current[targetKey].indexOf(laser.color.key) === -1) {
					diff.targets.current[targetKey].push(laser.color.key);
				}
			});
		});

		return diff;
	}
	/*--PRIVATE */

	/** Helper method. Returns brand new state object to fill. */
	_generateNewState() {
		return { targets: {}, valid: undefined };
	}
}