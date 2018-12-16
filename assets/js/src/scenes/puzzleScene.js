/**
 * puzzleScene.js
 *
 * Scene for the puzzle component of the game.
 */
import { KEYS, SPRITES } from '../../lib/CONST.js';
import { SceneHelper } from '../helpers/sceneHelper.js';
import { Surface } from '../model/surface.js';

export class PuzzleScene extends Phaser.Scene {

	constructor() {
		super({ key: KEYS.scene.puzzleScene });
	}

	init (data) {
		this.dungeon = data.dungeon;
		this.puzzle = data.puzzle;
	}

	preload() {
		SceneHelper.loadImage(this, SPRITES.laser);
		SceneHelper.loadImage(this, SPRITES.mirror);
		SceneHelper.loadImage(this, SPRITES.exit);
		SceneHelper.loadSpritesheet(this, SPRITES.target);
	}

	create() {
		// Create the laser
		let laserPosition = this.puzzle.laser.getPosition();
		let laserImage = this.physics.add.image(laserPosition.x, laserPosition.y, SPRITES.laser.key);

		if (this.puzzle.laser.movable) {
			laserImage.setInteractive();
			this.input.setDraggable(laserImage);
			laserImage.setCollideWorldBounds(true);
		}

		this.puzzle.laser.img = laserImage;

		// Create all of the surfaces
		this.puzzle.surfaces.forEach((surface) => {
			let position = surface.getPosition();
			let surfaceImage;

			if (surface.isTarget) {
				surfaceImage = this.physics.add.sprite(position.x, position.y, SPRITES.target.key);
				surfaceImage.setFrame(0);
			} else if (surface.type === Surface.OPAQUE) {
				surfaceImage = this.physics.add.image(position.x, position.y, SPRITES.opaqueSurface.key);
			} else {
				surfaceImage = this.physics.add.image(position.x, position.y, SPRITES.mirror.key);
			}

			if (surface.movable) {
				surfaceImage.setInteractive();
				this.input.setDraggable(surfaceImage);
				surfaceImage.setCollideWorldBounds(true);
			}

			surface.img = surfaceImage;
		});

		// Create the exit button in the top right-hand corner
		let exitImage = this.add.image(this.sys.canvas.width - 16, 8, SPRITES.exit.key).setInteractive();
		exitImage.on('pointerdown', (evt, objects) => {
			this.scene.start(KEYS.scene.traverseScene, { dungeon: this.dungeon, puzzle: this.puzzle });
		});

		// Handle other input bits
		this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
			gameObject.x = dragX;
			gameObject.y = dragY;
		});

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
		let targetSurface = this.puzzle.getTargetSurface();

		if (this.puzzle.solved) {
			targetSurface.img.setFrame(1);

			// TODO: Show the complete button

		} else {
			// TODO: replace the lit target for the unlit one
			targetSurface.img.setFrame(0);
		}

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
}