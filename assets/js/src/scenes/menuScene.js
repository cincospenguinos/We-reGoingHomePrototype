/**
 * menuScene.js
 *
 *
 * Scene for the main menu or pause menu. They can be the same thing.
 *
 * TODO: Design a good scene.
 */
import { KEYS, SPRITES } from '../../lib/CONST.js';
import { DungeonHelper } from '../helpers/dungeonHelper.js';
import { Player } from '../model/player.js';
import { SceneHelper } from '../helpers/sceneHelper.js';

export class MenuScene extends Phaser.Scene {

	constructor () {
		super({ key: KEYS.scene.menuScene });
	}

	preload() {
		SceneHelper.loadJson(this, KEYS.dungeons);
	}

	create() {
		let dungeon = DungeonHelper.generateDungeon(this, 'dungeon0');
		let puzzleList = DungeonHelper.getPuzzleList(this);

		for (let i = 0; i < puzzleList.length; i++) {
			let puzzleName = puzzleList[i];

			let puzzleText = this.add.text(32, i * 64 + 16, puzzleName, { fontSize: '32px', fill: '#FFFFFF'}).setInteractive();
			puzzleText.on('pointerdown', (evt, objects) => {
				let puzzle = dungeon.getPuzzle(puzzleName);
				this.scene.start(KEYS.scene.traverseScene, { dungeon: dungeon, puzzle: puzzle });
			});
		}
	}
}