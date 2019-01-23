/**
 * topDownScene.js
 *
 * Scene to manage a top-down scrolling view. Mostly for experimentation.
 */
import { KEYS, SPRITES, COLORS, PUZZLE_ROOM_SCALE } from '../../lib/CONST.js';
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

		this.mapKey = this.dungeon.getRoom(this.roomKey).mapName;
	}

	preload() {
		SceneHelper.loadImage(this, SPRITES.shittyTilesheet);
		this.load.tilemapTiledJSON(this.mapKey, 'assets/data/maps/' + this.mapKey + '.json');
		
		SceneHelper.loadImage(this, SPRITES.mainCharacter);
		SceneHelper.loadSpritesheet(this, SPRITES.roomPanel);
		SceneHelper.loadSpritesheet(this, SPRITES.roomLaser);
		SceneHelper.loadSpritesheet(this, SPRITES.roomMirror);
		SceneHelper.loadSpritesheet(this, SPRITES.roomTarget);
		SceneHelper.loadImage(this, SPRITES.roomExit);
		SceneHelper.loadImage(this, SPRITES.roomPlayer);

		this.load.json('dungeon0', 'assets/data/dungeons/dungeon0.json');
	}

	create() {
		// First generate the map
		let sandboxMap = this.make.tilemap({ key: this.mapKey, tileWidth: 64, tileHeight: 64 });

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

		this.layout.lasers.forEach((laser) => {
			puzzleItemGroup.create(laser.x, laser.y, SPRITES.roomLaser.key);
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
		let playerPos = this.playerPosition ? this.playerPosition : this.layout.playerPosition;
		this.playerImg = this.physics.add.image(playerPos.x, playerPos.y, SPRITES.roomPlayer.key);

		// Setup the exits
		this.layout.exits.forEach((exit) => {
			let exitImg = this.physics.add.image(exit.x, exit.y, SPRITES.roomExit.key);
			this.physics.add.overlap(this.playerImg, exitImg, (evt) => {
				if (exit.isOpen) {
					let room = this.dungeon.getRoom(exit.nextRoomKey);
					let puzzle = DungeonHelper.generatePuzzle(this, room.puzzleKey);
					this.scene.start(KEYS.scene.topDownScene, 
						{ 
							puzzle: puzzle,
							dungeon: this.dungeon, 
							roomKey: room.key,
							playerPosition: exit.nextRoomPlayerPosition
						});
				}
			});
		});

		// Setup the panels
		this.layout.panels.forEach((panel) => {
			let panelImage = puzzleItemGroup.create(panel.x, panel.y, SPRITES.roomPanel.key).setInteractive();
			panelImage.on('pointerover', (evt) => { panelImage.setFrame(1) });
			panelImage.on('pointerout', (evt) => { panelImage.setFrame(0) });
			panelImage.on('pointerdown', (evt) => {
				// If the player is close enough to the panel, we'll let them modify the puzzle
				let distance = Math.sqrt(Math.pow(this.playerImg.x - panel.x, 2) + Math.pow(this.playerImg.y - panel.y, 2))
				if (distance <= 150) {
					this.scene.start(KEYS.scene.puzzleScene, 
						{ 
							puzzle: this.puzzle, 
							dungeon: this.dungeon, 
							playerPosition: { 
								x: (this.playerImg.x - (roomDimensions.paddingLeft + roomDimensions.paddingRight)) / PUZZLE_ROOM_SCALE, 
								y: (this.playerImg.y - (roomDimensions.paddingTop + roomDimensions.paddingBottom)) / PUZZLE_ROOM_SCALE 
							}
					});
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