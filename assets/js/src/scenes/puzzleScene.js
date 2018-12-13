/**
 * puzzleScene.js
 *
 * Scene for the puzzle component of the game.
 */
import { KEYS } from '../../lib/CONST.js';
import { SceneHelper } from '../helpers/sceneHelper.js';

export class PuzzleScene extends Phaser.Scene {

	constructor() {
		super({ key: KEYS.scene.puzzleScene });
	}

	init (puzzle) {
		this.puzzle = puzzle;
	}

	preload() {
		SceneHelper.loadImage(this, KEYS.sprites.laser);
		SceneHelper.loadImage(this, KEYS.sprites.completeButton);
		this.load.spritesheet(KEYS.sprites.target.key, KEYS.sprites.target.location, {
			frameWidth: 64,
			frameHeight: 64
		});
	}

	create() {
		// Create the laser
		let laserPosition = this.puzzle.laser.getPosition();
		let laserImage = this.add.image(laserPosition.x, laserPosition.y, KEYS.sprites.laser.key);

		if (this.puzzle.laser.movable) {
			laserImage.setInteractive();
			this.input.setDraggable(laserImage);
		}

		this.puzzle.laser.img = laserImage;

		// Create all of the surfaces
		this.puzzle.surfaces.forEach((surface) => {
			let position = surface.getPosition();
			let surfaceImage;

			if (surface.isTarget) {
				surfaceImage = this.add.sprite(position.x, position.y, KEYS.sprites.target.key);
				surfaceImage.setFrame(0);
			} else if (surface.type === Surface.OPAQUE) {
				surfaceImage = this.add.image(position.x, position.y, KEYS.sprites.opaqueSurface.key);
			} else {
				surfaceImage = this.add.image(position.x, position.y, KEYS.sprites.mirror.key);
			}

			if (surface.movable) {
				surfaceImage.setInteractive();
				this.input.setDraggable(surfaceImage);
			}

			surface.img = surfaceImage;
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
			targetSurface.img.setFrame(1)

			// TODO: Show the complete button

		} else {
			// TODO: replace the lit target for the unlit one
			targetSurface.img.setFrame(0)
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