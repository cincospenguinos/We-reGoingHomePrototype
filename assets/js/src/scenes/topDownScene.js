/**
 * topDownScene.js
 *
 * Scene to manage a top-down scrolling view. Mostly for experimentation.
 */
import { KEYS, SPRITES, DIRECTION } from '../../lib/CONST.js';
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
		SceneHelper.loadSpritesheet(this, SPRITES.panel);
		SceneHelper.loadImage(this, SPRITES.laser);
		SceneHelper.loadImage(this, SPRITES.mirror);
		this.load.tilemapTiledJSON('sandboxMap', 'assets/data/maps/sandbox.json');
	}

	create() {
		// First generate the map
		let sandboxMap = this.make.tilemap({ key: 'sandboxMap', tileWidth: 64, tileHeight: 64 });

		const tileset = sandboxMap.addTilesetImage('tilesheet', 'tiles');

		// TODO: Collisions with floorLayer
		const floorLayer = sandboxMap.createStaticLayer('FloorLayer', tileset, 0, 0);
		const wallLayer = sandboxMap.createStaticLayer('WallLayer', tileset, 0, 0);

		// Draw the layout
		let roomDimensions = {
			width: sandboxMap.widthInPixels, 
			height: sandboxMap.heightInPixels,
			paddingLeft: 64,
			paddingRight: 64,
			paddingTop: 128,
			paddingBottom: 64
		};
		this.layout = DungeonHelper.generateTopDownLayout(this.puzzle, roomDimensions);
		console.log(this.layout);

		let puzzleItemGroup = this.physics.add.staticGroup();

		let laserImg = puzzleItemGroup.create(this.layout.laser.position.x, this.layout.laser.position.y, SPRITES.laser.key);
		laserImg.setScale(this.layout.laser.scale).refreshBody();

		this.layout.panels.forEach((panel) => {
			let panelSprite = this.add.sprite(panel.position.x, panel.position.y, SPRITES.panel.key).setInteractive();
			this.setupPanelInteractive(panel, panelSprite);
		});

		// Put together a new player
		this.playerImg = this.physics.add.image(this.layout.player.position.x, this.layout.player.position.y, SPRITES.mainCharacter.key);

		// TODO: Look into adding the world boundaries

		// console.log(this.puzzle.player.img);
		// console.log(laserImg);

		this.physics.add.collider(this.playerImg, puzzleItemGroup);

		// And now the camera
		this.cameras.main.setBounds(0, 0, sandboxMap.widthInPixels, sandboxMap.heightInPixels);
		this.cameras.main.startFollow(this.playerImg);

	 	this.keyboard = this.input.keyboard.addKeys('W, A, S, D');
	}

	update(time, delta) {
		this.handleInputs();
	}

	/** Handles inputs on the player. */
	handleInputs() {
		if (this.playerImg.active) {
			let north = this.keyboard.W.isDown;
			let east = this.keyboard.D.isDown;
			let south = this.keyboard.S.isDown;
			let west = this.keyboard.A.isDown;

			if (north) {
				this.playerImg.setVelocityY(-512);
			}

			if (east) {
				this.playerImg.setVelocityX(512);
			}

			if (south) {
				this.playerImg.setVelocityY(512);
			}

			if (west) {
				this.playerImg.setVelocityX(-512);
			}

			if (!east && !west) {
				this.playerImg.setVelocityX(0);
			}

			if (!north && !south) {
				this.playerImg.setVelocityY(0);
			}
		}
	}

	/** Helper method. Setup the interactive things for the panel. */
	setupPanelInteractive(panel, panelSprite) {
		switch(panel.direction) {
		case DIRECTION.EAST:
			panelSprite.setFrame(2);
			break;
		case DIRECTION.SOUTH:
			panelSprite.setFrame(0);
			break;
		case DIRECTION.WEST:
			panelSprite.setFrame(2);
			break;
		case DIRECTION.NORTH:
			panelSprite.setFrame(4);
			break;
		}


		this.input.on('pointerover', (a, b) => {
			switch(panel.direction) {
			case DIRECTION.EAST:
				panelSprite.setFrame(3);
				break;
			case DIRECTION.SOUTH:
				panelSprite.setFrame(1);
				break;
			case DIRECTION.WEST:
				panelSprite.setFrame(3);
				break;
			case DIRECTION.NORTH:
				panelSprite.setFrame(5);
				break;
			}
		});

		this.input.on('pointerout', (a, b) => {
			switch(panel.direction) {
			case DIRECTION.EAST:
				panelSprite.setFrame(2);
				break;
			case DIRECTION.SOUTH:
				panelSprite.setFrame(0);
				break;
			case DIRECTION.WEST:
				panelSprite.setFrame(2);
				break;
			case DIRECTION.NORTH:
				panelSprite.setFrame(4);
				break;
			}
		});
	}
}