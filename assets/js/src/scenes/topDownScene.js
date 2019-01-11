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
import { Direction } from '../model/direction.js';
import { MouseOverController } from '../controllers/mouseOverController.js';

export class TopDownScene extends Phaser.Scene {

	constructor() {
		super({ key: KEYS.scene.topDownScene });
	}

	init(data) {
		this.dungeon = data.dungeon;

		if (!data.room) {
			throw 'TopDownScene requires a room to function!';
		}

		this.mapKey = data.room.mapName;
		this.room = data.room;
		this.thoughtsController = data.thoughtsController;
		this.thoughtsController.setScene(this);

		this.mouseOverController = new MouseOverController(this);
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
		let playerImg = this.physics.add.image(this.room.player.position.x + (pad / 2), 
			this.room.player.position.y + pad, SPRITES.roomPlayer.key);
		playerImg.setCollideWorldBounds(true);
		this.room.player.setImg(playerImg);

		this.room.puzzleItems.forEach((item) => {
			let pos = { x: item.position.x + pad / 2, y: item.position.y + pad };
			let spriteKey, img;

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
						y2: line.y2 + pad,
						isHorizontal: line.isHorizontal
					};

					this.drawLaserLine(adjustedLine, laserGraphics, puzzleItemGroup);
				});
			} else if (item instanceof Exit) {
				spriteKey = SPRITES.roomExit.key;
			} else if (item instanceof Surface) {
				spriteKey = item.type === Surface.REFLECTIVE ? SPRITES.roomMirror.key : undefined; // TODO: Opaque surface?
			} else if (item instanceof Target) {
				spriteKey = SPRITES.roomTarget.key;
			} else { // It's a panel
				spriteKey = SPRITES.roomPanel.key;

				this.mouseOverController.addMouseOver(item);
			}

			// If we have an open door, we need an overlap, not a collision
			if (spriteKey === SPRITES.roomExit.key && item.isOpen) {
				switch(item.direction) {
				case Direction.SOUTH:
					pos.y += pad / 2;
					break;
				case Direction.NORTH:
					pos.y -= pad / 2;
					break;
				}

				img = this.physics.add.image(pos.x, pos.y, SPRITES.roomExit.key);
				item.setImg(img);

				this.physics.add.overlap(this.room.player.img, img, (evt) => {
					throw 'Implement moving rooms!';
				});
			} else { 
				img = puzzleItemGroup.create(pos.x, pos.y, spriteKey);
				item.setImg(img);
			}

			// If we have a panel, we need to set things up to be able to click on it and shit
			if (spriteKey === SPRITES.roomPanel.key) {
				img.setInteractive();
				img.on('pointerover', () => { this.mouseOverController.mouseOver(item.key) });
				img.on('pointerout', () => { this.mouseOverController.mouseOut(item.key) });
				img.on('pointerdown', (evt) => {
					// Since we had the player move over according to padding, we will need to remove that
					// padding before we jump right into the puzzle scene
					let newPlayerPos = { x: this.room.player.getPosition().x - (pad / 2), y: this.room.player.getPosition().y - pad };
					this.room.player.setPosition(newPlayerPos);
					SceneHelper.transitionToPuzzleScene(this, { dungeon: this.dungeon, room: this.room, thoughtsController: this.thoughtsController });
				});
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

	 	// Add the various thoughts we have
	 	this.room.getRoomThoughts().forEach((thought) => {
	 		this.thoughtsController.showThought(thought);
	 	});
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

	/** Helper method. Returns the midpoint of the line provided. */
	midpointOfLine(line) {
		return { x: (line.x2 + line.x1) / 2, y: (line.y2 + line.y1) / 2 }
	}

	/** Helper method. Draws a laser line using the graphics provided.*/
	drawLaserLine(line, graphics, group) {
		let midpoint = this.midpointOfLine(line);
		let zone;

		if (line.isHorizontal) {
			zone = this.add.zone(midpoint.x, midpoint.y, Math.abs(line.x2 - line.x1), 8);
		} else {
			zone = this.add.zone(midpoint.x, midpoint.y, 8, Math.abs(line.y2 - line.y1));
		}

		group.add(zone);
		graphics.strokeLineShape({
			x1: line.x1,
			y1: line.y1,
			x2: line.x2,
			y2: line.y2
		});
	}
}