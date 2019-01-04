/**
 * topDownScene.js
 *
 * Scene to manage a top-down scrolling view. Mostly for experimentation.
 */
import { KEYS, SPRITES, COLORS, PUZZLE_ROOM_SCALE } from '../../lib/CONST.js';
import { SceneHelper } from '../helpers/sceneHelper.js';
import { DungeonHelper } from '../helpers/dungeonHelper.js';
import { Surface } from '../model/surface.js';
import { Laser } from '../model/laser.js';
import { Target } from '../model/target.js';
import { Puzzle } from '../model/puzzle.js';
import { PuzzleItem } from '../model/puzzleItem.js';
import { Exit } from '../model/exit.js';
import { Player } from '../model/player.js';

export class TopDownScene extends Phaser.Scene {

	constructor() {
		super({ key: KEYS.scene.topDownScene });
	}

	init(data) {
		this.dungeon = data.dungeon;
		this.playerPosition = data.playerPosition;
		this.mapKey = data.room.mapName;
		this.laserGraphics = {};

		if (!data.room) {
			throw 'TopDownScene requires a room to function!';
		}

		let puzzle = DungeonHelper.roomToPuzzle(data.room);
		if (!puzzle.solve()) {
			throw 'Puzzle provided is invalid!';
		}

		this.room = DungeonHelper.puzzleToRoom(puzzle, data.room.mapName);
	}

	preload() {
		SceneHelper.loadImage(this, SPRITES.malkhutTilesheet);
		this.load.tilemapTiledJSON(this.mapKey, 'assets/data/maps/' + this.mapKey + '.json');
		
		SceneHelper.loadImage(this, SPRITES.mainCharacter);
		
		SceneHelper.loadSpritesheet(this, SPRITES.roomExit);
		SceneHelper.loadSpritesheet(this, SPRITES.roomPlayer);
		SceneHelper.loadSpritesheet(this, SPRITES.roomPanel);
		SceneHelper.loadSpritesheet(this, SPRITES.roomLaser);
		SceneHelper.loadSpritesheet(this, SPRITES.roomMirror);
		SceneHelper.loadSpritesheet(this, SPRITES.roomTarget);

		this.load.json('dungeon0', 'assets/data/dungeons/dungeon0.json');
	}

	create() {
		// First generate the map
		let sandboxMap = this.make.tilemap({ key: this.mapKey, tileWidth: 64, tileHeight: 64 });

		const tileset = sandboxMap.addTilesetImage(SPRITES.malkhutTilesheet.key, SPRITES.malkhutTilesheet.key);

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

		let pad = 128; // Since we are dropping everything according to some amount of padding, we need to accomodate

		let puzzleItemGroup = this.physics.add.staticGroup();

		// We are using the room provided to help us get everything down

		let playerImg = this.physics.add.image(this.room.player.position.x + (pad / 2), this.room.player.position.y + pad, SPRITES.roomPlayer.key);
		playerImg.setCollideWorldBounds(true);
		this.room.player.setImg(playerImg);

		this.room.puzzleItems.forEach((item) => {
			let pos = { x: item.position.x + pad / 2, y: item.position.y + pad };
			let spriteKey;

			if (item instanceof Laser) {
				spriteKey = SPRITES.roomLaser.key;

				let laserGraphics = this.add.graphics({
					add: true,
					lineStyle: {
						width: 8,
						color: item.color.val,
						alpha: 1
					}
				});
				
				item.getPathAsLines().forEach((line) => {
					let adjustedLine = {
						x1: line.x1 + pad / 2,
						y1: line.y1 + pad,
						x2: line.x2 + pad / 2,
						y2: line.y2 + pad
					};

					let midpoint = this.midpointOfLine(adjustedLine);
					let zone;

					if (line.isHorizontal) {
						zone = this.add.zone(midpoint.x, midpoint.y, Math.abs(line.x2 - line.x1), 8);
					} else {
						zone = this.add.zone(midpoint.x, midpoint.y, 8, Math.abs(line.y2 - line.y1));
					}

					puzzleItemGroup.add(zone);
					laserGraphics.strokeLineShape({
						x1: adjustedLine.x1,
						y1: adjustedLine.y1,
						x2: adjustedLine.x2,
						y2: adjustedLine.y2
					});
				});
			} else if (item instanceof Exit) {
				spriteKey = SPRITES.roomExit.key;
			} else if (item instanceof Surface) {
				spriteKey = item.type === Surface.REFLECTIVE ? SPRITES.roomMirror.key : undefined; // TODO: Opaque surface?
			} else if (item instanceof Target) {
				spriteKey = SPRITES.roomTarget.key;
			} else { // It's a panel
				spriteKey = SPRITES.roomPanel.key;
			}

			if (spriteKey === SPRITES.roomExit.key) { // TODO: Handle the open door

			} else { 
				let img = puzzleItemGroup.create(pos.x, pos.y, spriteKey);
				item.setImg(img);
			}
		});

		// Tie up various odds and ends with collision
		this.physics.world.setBounds(0, 0, sandboxMap.widthInPixels, sandboxMap.heightInPixels, true, true, true, true);
		this.physics.add.collider(playerImg, puzzleItemGroup);
		this.physics.add.collider(playerImg, wallLayer);

		// And now the camera
		this.cameras.main.setBounds(0, 0, sandboxMap.widthInPixels, sandboxMap.heightInPixels);
		this.cameras.main.startFollow(playerImg);

	 	this.keyboard = this.input.keyboard.addKeys('W, A, S, D');
	}

	update(time, delta) {
		this.handleInputs();
	}

	/** Handles inputs on the player. */
	handleInputs() {
		let playerImg = this.room.player.img;

		if (playerImg.active) {
			let north = this.keyboard.W.isDown;
			let east = this.keyboard.D.isDown;
			let south = this.keyboard.S.isDown;
			let west = this.keyboard.A.isDown;

			let vel = 300;

			if (north) {
				playerImg.setVelocityY(-vel);
				playerImg.setFrame(2);
			}

			if (south) {
				playerImg.setVelocityY(vel);
				playerImg.setFrame(0);
			}

			if (east) {
				playerImg.setVelocityX(vel);
				playerImg.setFrame(1);
			}

			if (west) {
				playerImg.setVelocityX(-vel);
				playerImg.setFrame(3);
			}

			if (!east && !west) {
				playerImg.setVelocityX(0);
			}

			if (!north && !south) {
				playerImg.setVelocityY(0);
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