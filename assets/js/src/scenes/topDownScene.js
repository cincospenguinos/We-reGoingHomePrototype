/**
 * topDownScene.js
 *
 * Scene to manage a top-down scrolling view. Mostly for experimentation.
 */
import { ItemFactory } from '../helpers/itemFactory.js';
import { KEYS, SPRITES, COLORS, PUZZLE_ROOM_SCALE, PADDING, ANIMS, SOUNDS } from '../../lib/CONST.js';
import { SceneHelper } from '../helpers/sceneHelper.js';
import { DungeonHelper } from '../helpers/dungeonHelper.js';
import { SoundHelper } from '../helpers/soundHelper.js';

import { Surface } from '../model/surface.js';
import { Laser } from '../model/laser.js';
import { Target } from '../model/target.js';
import { Puzzle } from '../model/puzzle.js';
import { PuzzleItem } from '../model/puzzleItem.js';
import { Exit } from '../model/exit.js';
import { Player } from '../model/player.js';
import { Direction } from '../model/direction.js';
import { Panel } from '../model/panel.js';
import { MouseOverController } from '../controllers/mouseOverController.js';
import { DoorsController } from '../controllers/doorsController.js';

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
		this.doorsController = new DoorsController(this);
		this.soundHelper = new SoundHelper(this);

		this.mapLayers = {};
		this.padding = { x: 64, y: 128 };
	}

	preload() {
		SceneHelper.loadImage(this, SPRITES.malkhutTilesheet);
		SceneHelper.loadImage(this, SPRITES.doorTilesheet);

		this.load.tilemapTiledJSON(this.mapKey, `assets/data/maps/${this.mapKey}.json`);
		
		SceneHelper.loadImage(this, SPRITES.mainCharacter);
		
		SceneHelper.loadSpritesheet(this, SPRITES.roomPlayer);
		SceneHelper.loadSpritesheet(this, SPRITES.roomPanel);
		SceneHelper.loadSpritesheet(this, SPRITES.roomLaser);
		SceneHelper.loadSpritesheet(this, SPRITES.roomMirror);
		SceneHelper.loadSpritesheet(this, SPRITES.roomTarget);
		SceneHelper.loadSpritesheet(this, SPRITES.roomTargetRedLit);

		this.soundHelper.loadSounds();

		this.load.json('dungeon0', 'assets/data/dungeons/dungeon0.json');
	}

	create() {
		this._generateMap();

		const itemFactory = new ItemFactory(this, this.padding);
		let puzzleItemGroup = this.physics.add.staticGroup();

		this.room.puzzleItems.forEach((item) => {
			let img = itemFactory.instantiateItem(item, puzzleItemGroup);
			if (!img) return;

			if (item instanceof Laser) {
				this._drawLaserPath(item, puzzleItemGroup);
			} else if (item instanceof Panel) {
				this._setupPanel(item);
			} 

			if (item instanceof Target && item.isLit()) {
				const config = {...ANIMS.room.targetRedLit};
				config.frames = this.anims.generateFrameNumbers(SPRITES.roomTargetRedLit.key)
				this.anims.create(config);
				img.anims.load(ANIMS.room.targetRedLit.key);
				img.anims.play(ANIMS.room.targetRedLit.key);
			} else {
				item.setProperFrame(true);
			}
		});

		let playerImg = this._createPlayer();

		const exitZones = this.physics.add.staticGroup();
		let exits = this.doorsController.presentProperExits(this.mapLayers['DoorLayer'], this.room);
		exitZones.addMultiple(exits);
		this.physics.add.overlap(playerImg, exitZones, (playerImg, exitZone) => { 
			this._moveRooms(exitZone.data.list.nextRoom) 
		});

		this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels, true, true, true, true);
		this.physics.add.collider(playerImg, puzzleItemGroup);
		this.physics.add.collider(playerImg, this.mapLayers['WallLayer']);
		this.mapLayers['WallLayer'].setCollisionByExclusion(-1);

		// And now the camera
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.startFollow(playerImg);

	 	this.keyboard = this.input.keyboard.addKeys('W, A, S, D');

	 	// Add the various thoughts we have
	 	this.room.getRoomThoughts().forEach((thought) => {
	 		this.thoughtsController.showThought(thought);
	 	});
	}

	update(time, delta) {
		this._handleInputs();
	}

	/*--PRIVATE */

	_generateMap() {
		const map = this.make.tilemap({ key: this.mapKey, tileWidth: 64, tileHeight: 64 });

		const malkuthTileset = map.addTilesetImage(SPRITES.malkhutTilesheet.key, SPRITES.malkhutTilesheet.key);
		const doorTileset = map.addTilesetImage(SPRITES.doorTilesheet.key, SPRITES.doorTilesheet.key);

		this.mapLayers['FloorLayer'] = map.createStaticLayer('FloorLayer', malkuthTileset, 0, 0);
		this.mapLayers['WallLayer'] = map.createDynamicLayer('WallLayer', malkuthTileset, 0, 0);
		this.mapLayers['DoorLayer'] = map.createDynamicLayer('DoorLayer', doorTileset, 0, 0);

		this.map = map;
	}

	/** Handles inputs on the player. */
	_handleInputs() {
		let playerImg = this.room.player.img;

		if (playerImg.active) {
			let north = this.keyboard.W.isDown;
			let east = this.keyboard.D.isDown;
			let south = this.keyboard.S.isDown;
			let west = this.keyboard.A.isDown;

			let vel = 300;

			if (north) {
				playerImg.setVelocityY(-vel);
				playerImg.anims.play('north', true);
			}

			if (south) {
				playerImg.setVelocityY(vel);
				playerImg.anims.play('south', true);
			}

			if (east) {
				playerImg.setVelocityX(vel);
				playerImg.anims.play('east', true);
			}

			if (west) {
				playerImg.setVelocityX(-vel);
				playerImg.anims.play('west', true);
			}

			if (!east && !west) {
				playerImg.setVelocityX(0);
			}

			if (!north && !south) {
				playerImg.setVelocityY(0);
			}

			if (!north && !south && !east && !west) {
				playerImg.anims.stop(null, true);
			}
		}
	}

	/** Helper method. Handles moving to the next room. */
	_moveRooms(nextRoomKey) {
		throw 'TODO: Move rooms';
	}

	/** Helper method. Returns the midpoint of the line provided. */
	_midpointOfLine(line) {
		return { x: (line.x2 + line.x1) / 2, y: (line.y2 + line.y1) / 2 }
	}

	/** Helper method. Draws the path of the laser, attaching each piece to the group provided. */
	_drawLaserPath(laser, group) {
		let laserGraphics = this.add.graphics({
			add: true,
			lineStyle: {
				width: 8,
				color: laser.color.val,
				alpha: 1
			}
		});
		
		laser.getPathAsLines().forEach((line) => {
			let adjustedLine = {
				x1: line.x1 + this.padding.x,
				y1: line.y1 + this.padding.y,
				x2: line.x2 + this.padding.x,
				y2: line.y2 + this.padding.y,
				isHorizontal: line.isHorizontal
			};

			// TODO: Is there a better way to do this?
			if (adjustedLine.x1 > this.room.dimensions.width) {
				adjustedLine.x1 = this.room.dimensions.width;
			}

			if (adjustedLine.x2 > this.room.dimensions.width) {
				adjustedLine.x2 = this.room.dimensions.width;
			}

			this._drawLaserLine(adjustedLine, laserGraphics, group);
		});
	}

	/** Helper method. Draws a laser line using the graphics provided.*/
	_drawLaserLine(line, graphics, group) {
		let midpoint = this._midpointOfLine(line);
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

	/** Helper method. Sets up a panel to operate the way we intend. */
	_setupPanel(panel) {
		this.mouseOverController.addMouseOver(panel);

		panel.img.setInteractive();
		panel.img.on('pointerover', () => { this.mouseOverController.mouseOver(panel.key) });
		panel.img.on('pointerout', () => { this.mouseOverController.mouseOut(panel.key) });
		panel.img.on('pointerdown', (evt) => {
			this.soundHelper.playSound(SOUNDS.openPanel.key);

			// Since we had the player move over according to padding, we will need to remove that
			// padding before we jump right into the puzzle scene
			let newPlayerPos = { 
				x: this.room.player.getPosition().x - (this.padding.x), 
				y: this.room.player.getPosition().y - this.padding.y 
			};
			this.room.player.setPosition(newPlayerPos);
			SceneHelper.transitionToPuzzleScene(this, { 
				dungeon: this.dungeon, 
				room: this.room, 
				thoughtsController: this.thoughtsController 
			});
		});
	}

	/** Helper method. Creates the player and handles world bounds collision. */
	_createPlayer() {
		let playerImg = this.physics.add.sprite(this.room.player.position.x + this.padding.x,
				this.room.player.position.y + this.padding.y, SPRITES.roomPlayer.key);
		playerImg.setCollideWorldBounds(true);

		// Let's also go ahead and create the player movement animations. We will probably want to adjust this
		// as needed
		// debugger;
		this.anims.create({
			key: 'south',
			frames: this.anims.generateFrameNumbers(SPRITES.roomPlayer.key, { start: 0, end: 6 }),
			frameRate: 10,
			repeat: 0,
		});

		this.anims.create({
			key: 'east',
			frames: this.anims.generateFrameNumbers(SPRITES.roomPlayer.key, { start: 7, end: 13 }),
			frameRate: 10,
			repeat: 0,
		});

		this.anims.create({
			key: 'north',
			frames: this.anims.generateFrameNumbers(SPRITES.roomPlayer.key, { start: 14, end: 20 }),
			frameRate: 10,
			repeat: 0,
		});

		this.anims.create({
			key: 'west',
			frames: this.anims.generateFrameNumbers(SPRITES.roomPlayer.key, { start: 21, end: 27 }),
			frameRate: 10,
			repeat: 0,
		});

		this.room.player.setImg(playerImg);
		return playerImg;
	}
}