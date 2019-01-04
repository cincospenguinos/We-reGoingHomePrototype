/**
 * menuScene.js
 *
 *
 * Scene for the main menu or pause menu. They can be the same thing.
 */
import { KEYS, SPRITES } from '../../lib/CONST.js';
import { DungeonHelper } from '../helpers/dungeonHelper.js';
import { Player } from '../model/player.js';
import { SceneHelper } from '../helpers/sceneHelper.js';
import { ThoughtsController } from '../controllers/thoughtsController.js';

export class MenuScene extends Phaser.Scene {

	constructor () {
		super({ key: KEYS.scene.menuScene });
	}

	preload() {
		this.load.json(KEYS.dungeon0.key, KEYS.dungeon0.location);
		this.load.json(KEYS.thoughts.key, KEYS.thoughts.location);
	}

	create() {
		let dungeon = DungeonHelper.generateDungeon(this, KEYS.dungeon0.key);
		let roomList = DungeonHelper.getPuzzleList(this);

		this.thoughtsController = new ThoughtsController(this.cache.json.get(KEYS.thoughts.key));

		for (let i = 0; i < roomList.length; i++) {
			let roomName = roomList[i];

			let puzzleText = this.add.text(32, i * 32 + 16, roomName, { fontSize: '16px', fill: '#FFFFFF'}).setInteractive();
			puzzleText.on('pointerdown', (evt, objects) => {
				let puzzle = DungeonHelper.roomToPuzzle(dungeon.getRoom(roomName));
				SceneHelper.transitionToTopDownScene(this, dungeon, puzzle, this.thoughtsController);
			});
		}

		this.add.text(this.sys.canvas.width - 128, 16, 'Editor', { fontSize: '16px', fill: '#FFFFFF'})
			.setInteractive()
			.on('pointerdown', (evt, objects) => {
				this.scene.start(KEYS.scene.levelEditorScene);
			});
	}
}