/**
 * roomItemFactory.js
 *
 * Factory for PuzzleItems that belong to a room. Handles translation work and adding to the scene.
 */
// import { PuzzleItem } from 'assets/js/src/model/puzzleItem.js';
import { Surface } from '../model/surface.js';
import { Laser } from '../model/laser.js';
import { Target } from '../model/target.js';
import { Puzzle } from '../model/puzzle.js';
import { PuzzleItem } from '../model/puzzleItem.js';
import { Exit } from '../model/exit.js';
import { Player } from '../model/player.js';
import { Direction } from '../model/direction.js';
import { Panel } from '../model/panel.js';
import { KEYS, SPRITES, COLORS, PUZZLE_ROOM_SCALE, PADDING } from '../../lib/CONST.js';

export class RoomItemFactory {
	constructor(padding) {
		this.padding = padding;
	}

	/** Instantiates the item into the group provided. Returns the item after instantiation, or 
		null in exceptional cases, like Exits. */
	instantiateItem(item, group) {
		const pos = this._translatedPosition(item.getPosition());
		const spriteKey = this._spriteKeyFor(item);

		if (spriteKey) {
			const img = group.create(pos.x, pos.y, spriteKey);
			item.setImg(img);
			return img;
		} else {
			return null;
		}
	}

	/*--PRIVATE */

	/** Helper method. Returns a sprite key for the given constructor name*/
	_spriteKeyFor(item) {
		let spriteKey = SPRITES[`room${item.constructor.name}`];

		if (!spriteKey) {
			switch(item.constructor.name) {
			case 'Surface':
				spriteKey = item.type === Surface.REFLECTIVE ? SPRITES.roomMirror.key : undefined; // TODO: Opaque surface?
				break;
			case 'Exit':
				return null;
			default:
				throw `No sprite key for ${item.constructor.name}!`;
			}
		} else {
			spriteKey = spriteKey.key;
		}

		return spriteKey;
	}

	_translatedPosition(initialPos) {
		return { x: initialPos.x + this.padding.x, y: initialPos.y + this.padding.y }
	}
}