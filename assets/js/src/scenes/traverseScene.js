/**
 * transverseScene.js
 *
 * Scene that handles movement after the puzzle has been solved.
 */
import { KEYS, SPRITES } from '../../lib/CONST.js';
import { SceneHelper } from '../helpers/sceneHelper.js';
import { DungeonHelper } from '../helpers/dungeonHelper.js';
import { Surface } from '../model/surface.js';

export class TraverseScene extends Phaser.Scene {

	constructor() {
		super({ key: KEYS.scene.traverseScene });
	}

	init(data) {
		this.dungeon = data.dungeon;
		this.puzzle = data.puzzle;
	}

	preload() {
		SceneHelper.loadImage(this, SPRITES.mainCharacter);
		SceneHelper.loadImage(this, SPRITES.background);
		SceneHelper.loadImage(this, SPRITES.laser);
		SceneHelper.loadImage(this, SPRITES.mirror);
		SceneHelper.loadImage(this, SPRITES.doorHorizontal);
		SceneHelper.loadImage(this, SPRITES.doorVertical);
		SceneHelper.loadSpritesheet(this, SPRITES.target)
		SceneHelper.loadSpritesheet(this, SPRITES.panel);
	}

	create() {
		// Setup input information
		this.keyboard = this.input.keyboard.addKeys('W, A, S, D');

		// Add the background
		this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, SPRITES.background.key);

		// Put together a new player
		let playerPosition = this.puzzle.player.getPosition();
		this.puzzle.player.img = this.physics.add.image(playerPosition.x, playerPosition.y, SPRITES.mainCharacter.key);
		this.puzzle.player.img.setCollideWorldBounds(true);

		let puzzleObjects = this.physics.add.staticGroup();

		// Create the laser
		let laserPosition = this.puzzle.laser.getPosition();
		let laserImage = puzzleObjects.create(laserPosition.x, laserPosition.y, SPRITES.laser.key);

		this.puzzle.laser.setImg(laserImage);

		// Create all of the surfaces
		this.puzzle.surfaces.forEach((surface) => {
			let position = surface.getPosition();
			let surfaceImage;

			if (surface.isTarget) {
				surfaceImage = puzzleObjects.create(position.x, position.y, SPRITES.target.key);
				surfaceImage.setFrame(0);
			} else if (surface.type === Surface.OPAQUE) {
				surfaceImage = puzzleObjects.create(position.x, position.y, SPRITES.opaqueSurface.key);
			} else {
				surfaceImage = puzzleObjects.create(position.x, position.y, SPRITES.mirror.key);
			}

			surface.img = surfaceImage;
		});

		// Create the panel as well
		this.puzzle.panels.forEach((panel) => {
			let panelPosition = panel.getPosition();
			let panelImage = puzzleObjects.create(panelPosition.x, panelPosition.y, SPRITES.panel.key).setInteractive();
			panelImage.setFrame(0);

			panelImage.on('pointerover', (evt, objects) => {
				panelImage.setFrame(1);
			});

			panelImage.on('pointerout', (evt, objects) => {
				panelImage.setFrame(0);
			});

			panelImage.on('pointerdown', (evt, objects) => {
				let playerPosition = this.puzzle.player.getPosition();
				
				let dist = Math.sqrt(Math.pow(panelImage.y - playerPosition.y, 2) + Math.pow(panelImage.x - playerPosition.x, 2));
				if (dist <= 75) {
					this.scene.start(KEYS.scene.puzzleScene, { dungeon: this.dungeon, puzzle: this.puzzle, player: this.puzzle.player });
				}
			});

			panel.img = panelImage;
		});

		// And the exits
		this.puzzle.exits.forEach((exit) => {
			let pos = exit.position;
			let doorImage = exit.useHorizontalDoor() ? this.physics.add.image(pos.x, pos.y, SPRITES.doorHorizontal.key) : this.physics.add.image(pos.x, pos.y, SPRITES.doorVertical.key);
			this.physics.add.overlap(this.puzzle.player.img, doorImage, () => {
				if (this.puzzle.solved) {
					this.exit(exit.nextRoomKey);
				}
			}, null, this);
		});

		// TODO: Create a set of zone objects that represent the lasers and put them in puzzleObjects so the player can't cross the laser

		this.physics.add.collider(this.puzzle.player.img, puzzleObjects);

		this.laserGraphics = this.add.graphics({
			add: true,
			lineStyle: {
				width: 1,
				color: 0xFF0707,
				alpha: 1
			}
		});
	}

	update() {
		this.handleInputs();

		// Check collision with the laser
		let points = this.puzzle.getLaserPath();

		// Draw the laser and shit
		this.laserGraphics.clear();
		for (let i = 0; i < points.length - 1; i++) {
			if (this.puzzle.player.laserIntersects(points[i], points[i + 1])) {
				// TODO: Find a way to just restart the scene from the beginning instead of this
				this.scene.start(KEYS.scene.menuScene);
			}

			this.laserGraphics.strokeLineShape({
				x1: points[i].x,
				y1: points[i].y,
				x2: points[i + 1].x,
				y2: points[i + 1].y
			});
		}
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

	exit(nextRoomKey) {
		let nextPuzzle = this.dungeon.getPuzzle(nextRoomKey);
		this.scene.start(KEYS.scene.traverseScene, { dungeon: this.dungeon, puzzle: nextPuzzle, player: this.puzzle.player });
	}
}