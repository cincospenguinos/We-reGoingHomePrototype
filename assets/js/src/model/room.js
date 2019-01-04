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
		this.puzzleItems = opts.puzzleItems || [];
		this.player = opts.player;

		if (!this.key) {
			throw 'Key and player position required for a room!';
		}

		if (!this.player) {
			console.warn('No player found for this room!');
		}
	}

	addPuzzleItem(item) {
		this.puzzleItems.push(item);
	}

	setPlayer(player) {
		player instanceof Player ? this.player = player : (() => { throw 'Player provided is not a player!' });
	}
}