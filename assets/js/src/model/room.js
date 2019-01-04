/**
 * room.js
 *
 * Rooms in a dungeon. This is to make things extra freaking simple.
 */
import { Player } from './player.js';

export class Room {

	constructor(opts) {
		this.key = opts.key;
		this.dimensions = opts.dimensions;
		this.mapName = opts.mapName;
		this.puzzleKey = opts.puzzleKey;

		this.puzzleItems = [];

		if (!this.key) {
			throw 'No key provided for this Room!';
		}
	}

	addPuzzleItem(item) {
		this.puzzleItems.push(item);
	}

	setPlayer(player) {
		player instanceof Player ? this.player = player : (() => { throw 'Player provided is not a player!' });
	}
}