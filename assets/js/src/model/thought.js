/**
 * thought.js
 *
 * Class representing a thought that appears onscreen.
 */
export class Thought {

	constructor(opts) {
		this.key = opts.key;
		this.position = opts.position;
		this.type = opts.type;
		this.fontCfg = opts.fontCfg || { fontSize: '32px', fill: '#EFEFEF', backgroundColor: '#101010' };
		this.dismissed = opts.dismissed || false;

		if (!this.key || !this.position || !Thought.validType(this.type)) {
			throw 'Key, position, and type required to instantiate a thought!';
		}
	}

	/** Helper method. Returns thought type given the string matching that type. */
	static stringToType(str) {
		if (str === 'ROOM') {
			return Thought.TYPE_ROOM;
		} else if (str === 'PUZZLE') {
			return Thought.TYPE_PUZZLE;
		}

		throw 'No type for "' + str + '"!';
	}

	/** Helper method. Returns true if the type provided is a valid type. */
	static validType(type) {
		return type === Thought.TYPE_ROOM || type === Thought.TYPE_PUZZLE;
	}
}

Thought.TYPE_ROOM = 0;
Thought.TYPE_PUZZLE = 1;