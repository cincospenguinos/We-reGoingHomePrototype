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
		this.playerPosition = data.playerPosition;

		this.laserGraphics = {};
	}

	preload() {
		SceneHelper.loadSpritesheet(this, SPRITES.puzzleLaser);
		SceneHelper.loadSpritesheet(this, SPRITES.puzzleTarget);
		SceneHelper.loadSpritesheet(this, SPRITES.puzzleMirror);
	}

	create() {
		// Since the size of the puzzles change, we need to change the size of the world to accomodate. We need to figure out
		// the width and height of the puzzle, find the difference between the size of the canvas and and the puzzle, and
		// then use that to determine the padding in various ways
		this.physics.world.setBounds(0, 0, this.puzzle.dimensions.width, this.puzzle.dimensions.height);

		// Create the lasers
		this.puzzle.getLasers().forEach((laser) => {
			let laserPosition = laser.getPosition();
			let laserImage = this.physics.add.sprite(laserPosition.x, laserPosition.y, SPRITES.puzzleLaser.key);

			if (laser.movable || laser.rotatable) {
				this.setupInteractivity(laser, laserImage);
			}

			laser.setImg(laserImage);

			this.laserGraphics[laser.key] = this.add.graphics({
				add: true,
				lineStyle: {
					width: 1,
					color: laser.color,
					alpha: 1
				}
			});
		});

		this.puzzle.getTargets().forEach((target) => {
			let targetPosition = target.getPosition();
			let targetImage = this.physics.add.sprite(targetPosition.x, targetPosition.y, SPRITES.puzzleTarget.key);

			if (target.movable || target.rotatable) {
				this.setupInteractivity(target, targetImage);
			}

			target.setImg(targetImage);
		});

		this.puzzle.surfaces.forEach((surface) => {
			let surfacePosition = surface.getPosition();
			let surfaceImage = null;

			if (surface.type === Surface.REFLECTIVE) {
				surfaceImage = this.physics.add.sprite(surfacePosition.x, surfacePosition.y, SPRITES.puzzleMirror.key);
			} else {
				throw 'Need an opaque surface!';
			}

			if (surface.movable || surface.rotatable) {
				this.setupInteractivity(surface, surfaceImage);
			}

			surface.setImg(surfaceImage);
		});

		// Handle other input bits
		this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

		this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
			gameObject.x = dragX;
			gameObject.y = dragY;
		});
	}

	update() {
		this.handleRotation();
		this.puzzle.solve();

		Object.keys(this.puzzle.lasers).forEach((laserKey) => {
			let laserGraphics = this.laserGraphics[laserKey];
			let points = this.puzzle.lasers[laserKey].path;

			laserGraphics.clear();
			for (let i = 0; i < points.length - 1; i++) {
				laserGraphics.strokeLineShape({
					x1: points[i].x,
					y1: points[i].y,
					x2: points[i + 1].x,
					y2: points[i + 1].y
				});
			}
		});
	}

	/** Checks for rotation buttons and handles the rotation on the game object in question. */
	handleRotation() {
		if (this.pointerOverObj && this.pointerOverObj.rotatable) {
			if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
				this.pointerOverObj.rotate(-90);
			} else if (Phaser.Input.Keyboard.JustDown(this.keyD)) {
				this.pointerOverObj.rotate(90);
			}
		}
	}

	/** Helper method. Handles interactivity for the model object and game object.*/
	setupInteractivity(modelObj, gameObj) {
		gameObj.setInteractive();
		
		if (modelObj.movable) {
			this.input.setDraggable(gameObj);
			gameObj.setCollideWorldBounds(true);
		}

		gameObj.on('pointerover', (evt, objects) => {
			this.pointerOverObj = modelObj;
			modelObj.pointerOver();
		});

		gameObj.on('pointerout', (evt, objects) => {
			this.pointerOverObj = null;
			modelObj.pointerOut();
		});
	}
}