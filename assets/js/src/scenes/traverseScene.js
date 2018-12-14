/**
 * transverseScene.js
 *
 * Scene that handles movement after the puzzle has been solved.
 */
import { KEYS, SPRITES } from '../../lib/CONST.js';
import { SceneHelper } from '../helpers/sceneHelper.js';
import { Surface } from '../model/surface.js';

export class TraverseScene extends Phaser.Scene {

	constructor() {
		super({ key: KEYS.scene.traverseScene });
	}

	init(data) {
		this.puzzle = data.puzzle;
		this.player = data.player;
	}

	preload() {
		SceneHelper.loadImage(this, SPRITES.mainCharacter);
		SceneHelper.loadImage(this, SPRITES.background);
		SceneHelper.loadImage(this, SPRITES.laser);
		SceneHelper.loadImage(this, SPRITES.mirror);
		SceneHelper.loadSpritesheet(this, SPRITES.target)
		SceneHelper.loadSpritesheet(this, SPRITES.panel);
	}

	create() {
		// Setup input information
		this.keyboard = this.input.keyboard.addKeys('W, A, S, D, E');

		// Add the background
		this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, SPRITES.background.key);

		// Put together a new player
		this.player.img = this.physics.add.image(this.player.position.x, this.player.position.y, SPRITES.mainCharacter.key);
		this.player.img.setCollideWorldBounds(true);

		let puzzleObjects = this.physics.add.staticGroup();

		// Create the laser
		let laserPosition = this.puzzle.laser.getPosition();
		let laserImage = puzzleObjects.create(laserPosition.x, laserPosition.y, SPRITES.laser.key);

		this.puzzle.laser.img = laserImage;

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

		this.physics.add.collider(this.player.img, puzzleObjects);

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

		// TODO: Check collision with the laser

		// TODO: Draw the laser and shit
		let points = this.puzzle.getLaserPath();

		this.laserGraphics.clear();
		for (let i = 0; i < points.length - 1; i++) {
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
		if (this.player.img.active) {
			let north = this.keyboard.W.isDown;
			let east = this.keyboard.D.isDown;
			let south = this.keyboard.S.isDown;
			let west = this.keyboard.A.isDown;

			if (north) {
				this.player.setVelocityY(-this.player.maxVelocity);
			}

			if (east) {
				this.player.setVelocityX(this.player.maxVelocity);
			}

			if (south) {
				this.player.setVelocityY(this.player.maxVelocity);
			}

			if (west) {
				this.player.setVelocityX(-this.player.maxVelocity);
			}

			if (!east && !west) {
				this.player.setVelocityX(0);
			}

			if (!north && !south) {
				this.player.setVelocityY(0);
			}
		}
	}
}