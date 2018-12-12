/**
 * menuScene.js
 *
 *
 * Scene for the main menu or pause menu. They can be the same thing.
 *
 * TODO: Design a good scene.
 */
import { KEYS } from '../../lib/CONST.js';
import { PuzzleHelper } from '../helpers/puzzleHelper.js';

export class MenuScene extends Phaser.Scene {

	constructor () {
		super({ key: KEYS.scene.menuScene });
	}

	preload() {
		this.load.image(KEYS.sprites.menuOne.key, KEYS.sprites.menuOne.location);
	}

	create() {
		let puzzle1 = this.add.image(100, 100, KEYS.sprites.menuOne.key).setInteractive();

		puzzle1.on('pointerdown', (ptr) => {
			let puzzle = PuzzleHelper.puzzleOne(this.sys.canvas.width, this.sys.canvas.height);
			this.scene.start(KEYS.scene.puzzleScene, puzzle);
		});
	}
}