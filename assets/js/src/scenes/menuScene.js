/**
 * menuScene.js
 *
 *
 * Scene for the main menu or pause menu. They can be the same thing.
 *
 * TODO: Design a good scene.
 */
import { KEYS, SPRITES, PUZZLES } from '../../lib/CONST.js';
import { PuzzleHelper } from '../helpers/puzzleHelper.js';
import { Player } from '../model/player.js';
import { SceneHelper } from '../helpers/sceneHelper.js';

export class MenuScene extends Phaser.Scene {

	constructor () {
		super({ key: KEYS.scene.menuScene });
	}

	preload() {
		this.load.image(SPRITES.menuOne.key, SPRITES.menuOne.location);
		SceneHelper.loadJson(this, KEYS.puzzles);
	}

	create() {
		let puzzle1 = this.add.image(100, 100, SPRITES.menuOne.key).setInteractive();

		puzzle1.on('pointerdown', (ptr) => {
			let puzzle = PuzzleHelper.getPuzzle(this, PUZZLES.puzzle0.key);
			let player = new Player({
				position: { x: 10, y: this.sys.canvas.height - 20 },
				dimensions: { width: 16, height: 16 }
			});

			this.scene.start(KEYS.scene.traverseScene, { puzzle: puzzle, player: player });
		});
	}
}