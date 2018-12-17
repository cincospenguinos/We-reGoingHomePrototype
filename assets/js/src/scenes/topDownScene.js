/**
 * topDownScene.js
 *
 * Scene to manage a top-down scrolling view. Mostly for experimentation.
 */
import { KEYS, SPRITES } from '../../lib/CONST.js';
import { SceneHelper } from '../helpers/sceneHelper.js';
import { DungeonHelper } from '../helpers/dungeonHelper.js';

export class TopDownScene extends Phaser.Scene {

	constructor() {
		super({ key: KEYS.scene.topDownScene });
	}

	init(data) {
		this.puzzle = data.puzzle;
		this.dungeon = data.dungeon;
	}

	preload() {
		this.load.image('tiles', 'assets/sprites/tilesheet.png');
		this.load.image('door', 'assets/sprites/door.png');
		SceneHelper.loadImage(this, SPRITES.mainCharacter);
		SceneHelper.loadImage(this, SPRITES.panel);
		this.load.tilemapTiledJSON('sandboxMap', 'assets/data/maps/sandbox.json');
	}

	create() {
		// First generate the map
		let sandboxMap = this.make.tilemap({ key: 'sandboxMap', tileWidth: 64, tileHeight: 64 });

		const tileset = sandboxMap.addTilesetImage('roomTilesheet', 'tiles');

		const floorLayer = sandboxMap.createStaticLayer('FloorLayer', tileset, 0, 0);
		const wallLayer = sandboxMap.createStaticLayer('WallLayer', tileset, 0, 0);

		// Get the layout
		this.layout = DungeonHelper.generateTopDownLayout(this.puzzle, sandboxMap.widthInPixels, sandboxMap.heightInPixels);

		// Now draw everything

		// Put together a new player
		this.puzzle.player.img = this.physics.add.image(this.layout.player.position.x, this.layout.player.position.y, SPRITES.mainCharacter.key);

		// TODO: Look into adding the world boundaries
		// this.puzzle.player.img.setCollideWorldBounds(true);

		// And now the camera
		this.cameras.main.setBounds(0, 0, sandboxMap.widthInPixels, sandboxMap.heightInPixels);
		this.cameras.main.startFollow(this.puzzle.player.img);

	 	this.keyboard = this.input.keyboard.addKeys('W, A, S, D');
	}

	update(time, delta) {
		this.handleInputs();
	}

	/** Handles inputs on the player. */
	handleInputs() {
		if (this.puzzle.player.img.active) {
			let north = this.keyboard.W.isDown;
			let east = this.keyboard.D.isDown;
			let south = this.keyboard.S.isDown;
			let west = this.keyboard.A.isDown;

			if (north) {
				this.puzzle.player.setVelocityY(-this.puzzle.player.maxVelocity);
			}

			if (east) {
				this.puzzle.player.setVelocityX(this.puzzle.player.maxVelocity);
			}

			if (south) {
				this.puzzle.player.setVelocityY(this.puzzle.player.maxVelocity);
			}

			if (west) {
				this.puzzle.player.setVelocityX(-this.puzzle.player.maxVelocity);
			}

			if (!east && !west) {
				this.puzzle.player.setVelocityX(0);
			}

			if (!north && !south) {
				this.puzzle.player.setVelocityY(0);
			}
		}
	}
}