/**
 * dungeon.js
 *
 * A dungeon is a set of rooms that the player can interact with. Each room is a puzzle, and vice-versa.
 */
import { Room } from './room.js';

export class Dungeon {

	constructor() {
		this.rooms = {};
	}

	/** Adds the puzzle to the collection. */
	addRoom(key, room) {
		if (room instanceof Room) {
			this.rooms[key] = room;
		} else {
			throw 'Object "' + room + '" is not a puzzle!'
		}
	}

	/** Get the puzzle matching the key provided. */
	getRoom(key) {
		let room = this.rooms[key];

		if (!room) {
			throw 'No room with key "' + key + '" was found!';
		}

		return room;
	}
}