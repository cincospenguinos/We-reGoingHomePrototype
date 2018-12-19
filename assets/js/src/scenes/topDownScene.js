/**
 * topDownScene.js
 *
 * Scene to manage a top-down scrolling view. Mostly for experimentation.
 */
import { KEYS, SPRITES, DIRECTION } from '../../lib/CONST.js';
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
		SceneHelper.loadSpritesheet(this, SPRITES.roompanel);
		SceneHelper.loadSpritesheet(this, SPRITES.roomLaser);
		SceneHelper.loadSpritesheet(this, SPRITES.roomMirror);
		SceneHelper.loadSpritesheet(this, SPRITES.roomTarget);
		SceneHelper.loadImage(this, SPRITES.roomExit);
	}

	create() {
		throw 'Fix me!';

		// First generate the map
		let sandboxMap = this.make.tilemap({ key: this.roomKey, tileWidth: 64, tileHeight: 64 });

		const tileset = sandboxMap.addTilesetImage(SPRITES.shittyTilesheet.key, SPRITES.shittyTilesheet.key);

		// TODO: Collisions with floorLayer
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
			paddingBottom: 64
		};

		this.layout = DungeonHelper.generateTopDownLayout(this.puzzle, roomDimensions);

		let puzzleItemGroup = this.physics.add.staticGroup();

		let laserImg = puzzleItemGroup.create(this.layout.laser.position.x, this.layout.laser.position.y, SPRITES.laser.key);
		laserImg.setScale(this.layout.laser.scale).refreshBody();

		this.layout.surfaces.forEach((surface) => {
			let surfaceImg;

			if (surface.isTarget) {
				surfaceImg = puzzleItemGroup.create(surface.position.x, surface.position.y, SPRITES.target.key);
				this.puzzle.complete ? surfaceImg.setFrame(1) : surfaceImg.setFrame(0);
			} else if (surface.type === Surface.REFLECTIVE) {
				surfaceImg = puzzleItemGroup.create(surface.position.x, surface.position.y, SPRITES.mirror.key);
			} else {
				throw 'I do not have a sprite for this surface!';
			}

			surfaceImg.setScale(surface.scale).refreshBody();
		});

		this.layout.panels.forEach((panel) => {
			let panelSprite = this.add.sprite(panel.position.x, panel.position.y, SPRITES.panel.key).setInteractive();
			this.setupPanelInteractive(panel, panelSprite);
		});

		// Put together a new player
		if (this.playerPosition) {
			this.playerImg = this.physics.add.image(this.playerPosition.x, this.playerPosition.y, SPRITES.mainCharacter.key);
		} else {
			this.playerImg = this.physics.add.image(this.layout.player.position.x, this.layout.player.position.y, SPRITES.mainCharacter.key);
		}

		this.layout.exits.forEach((exit) => {
			let exitImg = this.physics.add.sprite(exit.position.x, exit.position.y, SPRITES.topDownDoor.key);

			switch(exit.direction) {
			case DIRECTION.EAST:
				this.puzzle.complete ? exitImg.setFrame(7) : exitImg.setFrame(6);
				break;
			case DIRECTION.SOUTH:
				this.puzzle.complete ? exitImg.setFrame(1) : exitImg.setFrame(0);
				break;
			case DIRECTION.WEST:
				this.puzzle.complete ? exitImg.setFrame(3) : exitImg.setFrame(2);
				break;
			case DIRECTION.NORTH:
				this.puzzle.complete ? exitImg.setFrame(5) : exitImg.setFrame(4);
				break;
			}

			this.physics.add.overlap(exitImg, this.playerImg, (evt) => {
				let nextPuzzle = this.dungeon.getPuzzle(exit.nextPuzzleKey);
				this.scene.start(KEYS.scene.topDownScene, { 
					dungeon: this.dungeon, 
					puzzle: nextPuzzle, 
				});
			}, null, this);
		});

		// Draw the laser using graphics
		let laserGraphics = this.add.graphics({
			add: true,
			lineStyle: {
				width: 10,
				color: 0xFF0707,
				alpha: 1
			}
		});
		
		this.layout.lines.forEach((line) => {
			let midpoint = this.midpointOfLine(line);
			let zone;

			if (line.horizontal) {
				zone = this.add.zone(midpoint.x, midpoint.y, Math.abs(line.x2 - line.x1), 10);
			} else {
				zone = this.add.zone(midpoint.x, midpoint.y, 10, Math.abs(line.y2 - line.y1));
			}

			puzzleItemGroup.add(zone);

			laserGraphics.strokeLineShape({
				x1: line.x1,
				y1: line.y1,
				x2: line.x2,
				y2: line.y2
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
			this.scene.start(KEYS.scene.puzzleScene, { dungeon: this.dungeon, puzzle: this.puzzle, playerPosition: { x: this.playerImg.x, y: this.playerImg.y }  });
		});
	}

	/** Helper method. Returns the midpoint of the line provided. */
	midpointOfLine(line) {
		return { x: (line.x2 + line.x1) / 2, y: (line.y2 + line.y1) / 2 }
	}
}