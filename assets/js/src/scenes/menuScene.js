/**
 * menuScene.js
 *
 *
 * Scene for the main menu or pause menu. They can be the same thing.
 *
 * TODO: Design a good scene.
 */
import { KEYS, SPRITES } from '../../lib/CONST.js';
import { PuzzleHelper } from '../helpers/puzzleHelper.js';
import { Player } from '../model/player.js';

export class MenuScene extends Phaser.Scene {

	constructor () {
		super({ key: KEYS.scene.menuScene });
	}

	preload() {
		this.load.image(SPRITES.menuOne.key, SPRITES.menuOne.location);
	}

	create() {
		let puzzle1 = this.add.image(100, 100, SPRITES.menuOne.key).setInteractive();

		puzzle1.on('pointerdown', (ptr) => {
			let puzzle = PuzzleHelper.puzzleOne(this.sys.canvas.width, this.sys.canvas.height);
			let player = new Player({
				position: { x: 10, y: this.sys.canvas.height - 20 }
			});
			// this.scene.start(KEYS.scene.puzzleScene, puzzle);
			this.scene.start(KEYS.scene.traverseScene, { puzzle: puzzle, player: player });
		});
	}
}