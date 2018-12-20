/**
 * topDownScene.js
 *
 * Scene to manage a top-down scrolling view. Mostly for experimentation.
 */
import { KEYS, SPRITES, COLORS } from '../../lib/CONST.js';
import { SceneHelper } from '../helpers/sceneHelper.js';
import { DungeonHelper } from '../helpers/dungeonHelper.js';
import { Surface } from '../model/surface.js';

export class TopDownScene extends Phaser.Scene {

	constructor() {
		super({ key: KEYS.scene.topDownScene });
	}

	init(data) {
		this.puzzle = data.puzzle;
		this.dungeon = data.dungeon;
		this.roomKey = data.roomKey;
		this.playerPosition = data.playerPosition;
	}

	preload() {
		SceneHelper.loadImage(this, SPRITES.shittyTilesheet);
		this.load.tilemapTiledJSON(this.roomKey, 'assets/data/maps/' + this.roomKey + '.json');
		
		SceneHelper.loadImage(this, SPRITES.mainCharacter);
		SceneHelper.loadSpritesheet(this, SPRITES.roomPanel);
		SceneHelper.loadSpritesheet(this, SPRITES.roomLaser);
		SceneHelper.loadSpritesheet(this, SPRITES.roomMirror);
		SceneHelper.loadSpritesheet(this, SPRITES.roomTarget);
		SceneHelper.loadImage(this, SPRITES.roomExit);
		SceneHelper.loadImage(this, SPRITES.roomPlayer);
	}

	create() {
		// First generate the map
		let sandboxMap = this.make.tilemap({ key: this.roomKey, tileWidth: 64, tileHeight: 64 });

		const tileset = sandboxMap.addTilesetImage(SPRITES.shittyTilesheet.key, SPRITES.shittyTilesheet.key);

		const floorLayer = sandboxMap.createStaticLayer('FloorLayer', tileset, 0, 0);
		const wallLayer = sandboxMap.createDynamicLayer('WallLayer', tileset, 0, 0);

		wallLayer.setCollisionByProperty({ collides: true });

		// Draw the layout
		let roomDimensions = {
			width: sandboxMap.widthInPixels, 
			height: sandboxMap.heightInPixels,
			paddingLeft: 64,
			paddingRight: 64,
			paddingTop: 128,
			paddingBottom: 0
		};

		this.layout = DungeonHelper.generateTopDownLayout(this.puzzle, roomDimensions);

		let puzzleItemGroup = this.physics.add.staticGroup();
		// let exitGroup = this.physics.add.staticGroup();

		this.layout.lasers.forEach((laser) => {
			puzzleItemGroup.create(laser.x, laser.y, SPRITES.roomLaser.key);
		});

		this.layout.panels.forEach((panel) => {
			let panelImage = puzzleItemGroup.create(panel.x, panel.y, SPRITES.roomPanel.key).setInteractive();
			// TODO: Going to the panel view
		});

		// Setup the surfaces
		this.layout.surfaces.forEach((surface) => {
			if (surface.type === Surface.REFLECTIVE) {
				puzzleItemGroup.create(surface.x, surface.y, SPRITES.roomMirror.key);
			} else {
				throw 'I do not have an opaque suraface sprite!';
			}
		});

		// Setup the targets
		this.layout.targets.forEach((target) => {
			let targetImg = puzzleItemGroup.create(target.x, target.y, SPRITES.roomTarget.key);

			if (target.isLit) {
				targetImg.setFrame(1);
			}
		})

		// Setup the player
		this.playerImg = this.physics.add.image(this.layout.playerPosition.x, this.layout.playerPosition.y, SPRITES.roomPlayer.key);

		// Setup the exits
		this.layout.exits.forEach((exit) => {
			let exitImg = this.physics.add.image(exit.x, exit.y, SPRITES.roomExit.key);
			this.physics.add.overlap(this.playerImg, exitImg, (evt) => {
				if (exit.isOpen) {
					let room = this.dungeon.getRoom(exit.nextRoomKey);
					this.scene.start(KEYS.scene.topDownScene, { puzzle: room.puzzle, dungeon: this.dungeon, roomKey: room.key });
				}
			});
		});

		// Setup the laser paths
		// TODO: lasers of other colors?
		let laserGraphics = this.add.graphics({
			add: true,
			lineStyle: {
				width: 8,
				color: COLORS.RED,
				alpha: 1
			}
		});

		this.layout.laserPaths.forEach((path) => {
			path.forEach((line) => {
				let midpoint = this.midpointOfLine(line);
				let zone;

				if (line.isHorizontal) {
					zone = this.add.zone(midpoint.x, midpoint.y, Math.abs(line.x2 - line.x1), 8);
				} else {
					zone = this.add.zone(midpoint.x, midpoint.y, 8, Math.abs(line.y2 - line.y1));
				}

				puzzleItemGroup.add(zone);
				laserGraphics.strokeLineShape({
					x1: line.x1,
					y1: line.y1,
					x2: line.x2,
					y2: line.y2
				});
			});
		});

		// TODO: Look into adding the world boundaries
		this.physics.world.setBounds(0, 0, sandboxMap.widthInPixels, sandboxMap.heightInPixels, true, true, true, true);
		this.playerImg.setCollideWorldBounds(true);
		this.physics.add.collider(this.playerImg, puzzleItemGroup);
		this.physics.add.collider(this.playerImg, wallLayer);

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
		// TODO: Add the check to see if the player is close enough to the panel
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


		panelSprite.on('pointerover', (a, b) => {
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

		panelSprite.on('pointerout', (a, b) => {
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

		panelSprite.on('pointerdown', (a, b) => {
			// TODO: Add the player here
			this.scene.start(KEYS.scene.puzzleScene, { 
				dungeon: this.dungeon, 
				puzzle: this.puzzle, 
				playerPosition: { x: this.playerImg.x, y: this.playerImg.y }  
			});
		});
	}

	/** Helper method. Returns the midpoint of the line provided. */
	midpointOfLine(line) {
		return { x: (line.x2 + line.x1) / 2, y: (line.y2 + line.y1) / 2 }
	}
}