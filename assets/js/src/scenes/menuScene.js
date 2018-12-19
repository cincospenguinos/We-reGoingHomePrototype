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
		// TODO: Put this information into CONST
		this.load.json(KEYS.dungeon0.key, KEYS.dungeon0.location);
	}

	create() {
		let dungeon = DungeonHelper.generateDungeon(this, KEYS.dungeon0.key);
		let roomList = DungeonHelper.getPuzzleList(this);

		for (let i = 0; i < roomList.length; i++) {
			let roomName = roomList[i];

			let puzzleText = this.add.text(32, i * 32 + 16, roomName, { fontSize: '16px', fill: '#FFFFFF'}).setInteractive();
			puzzleText.on('pointerdown', (evt, objects) => {
				let puzzleKey = dungeon.getRoom(roomName).puzzleKey;

				this.scene.start(KEYS.scene.puzzleScene, { dungeon: dungeon, puzzle: DungeonHelper.generatePuzzle(this, puzzleKey) });

				// this.scene.start(KEYS.scene.topDownScene, { dungeon: dungeon, puzzle: puzzle });
				// this.scene.start(KEYS.scene.puzzleScene, { dungeon: dungeon, puzzle: puzzle });
			});
		}
	}
}