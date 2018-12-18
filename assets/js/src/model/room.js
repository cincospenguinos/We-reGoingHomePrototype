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

		if (!this.key) {
			throw 'No key provided for this Room!';
		}
	}

	setPlayer(player) {
		player instanceof Player ? this.player = player : (() => { throw 'Player provided is not a player!' });
	}
}