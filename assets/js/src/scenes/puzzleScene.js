/**
 * puzzleScene.js
 *
 * Scene for the puzzle component of the game.
 */
import { KEYS, SPRITES, ANIMS } from '../../lib/CONST.js';
import { SceneHelper } from '../helpers/sceneHelper.js';
import { ItemFactory } from '../helpers/itemFactory.js';
import { PuzzleSolver } from '../helpers/puzzleSolver.js';
import { AnimationHelper } from '../helpers/animationHelper.js';

import { Surface } from '../model/surface.js';
import { Laser } from '../model/laser.js';
import { Target } from '../model/target.js';
import { Puzzle } from '../model/puzzle.js';
import { PuzzleItem } from '../model/puzzleItem.js';
import { Exit } from '../model/exit.js';
import { Player } from '../model/player.js';
import { Direction } from '../model/direction.js';
import { MouseOverController } from '../controllers/mouseOverController.js';


export class PuzzleScene extends Phaser.Scene {

	constructor() {
		super({ key: KEYS.scene.puzzleScene });
	}

	init (data) {
		this.dungeon = data.dungeon;
		this.puzzle = data.puzzle;
		this.thoughtsController = data.thoughtsController;
		this.thoughtsController.setScene(this);

		this.mouseOverController = new MouseOverController(this);
		this.animationHelper = new AnimationHelper(this);

		this.laserGraphics = {};

		// Since we want to have the puzzle scene appear in the center of the screen, we need to do the math to figure out where
		// exactly things go
		this.translation = this.getPuzzleTranslation(this.puzzle.dimensions);
		this.puzzle.setTranslation(this.translation);
		this.puzzleSolver = new PuzzleSolver(this.puzzle);
	}

	preload() {
		SceneHelper.loadSpritesheet(this, SPRITES.puzzleLaser);
		SceneHelper.loadSpritesheet(this, SPRITES.puzzleTarget);
		SceneHelper.loadSpritesheet(this, SPRITES.puzzleMirror);
		SceneHelper.loadSpritesheet(this, SPRITES.puzzleExit);
		SceneHelper.loadSpritesheet(this, SPRITES.puzzleExitRed);
		SceneHelper.loadSpritesheet(this, SPRITES.puzzlePanel);
		SceneHelper.loadSpritesheet(this, SPRITES.puzzleTargetRed);
		
		SceneHelper.loadImage(this, SPRITES.puzzlePlayer);
	}

	create() {
		this.animationHelper.createAnimations(this.puzzle);

		this.add.graphics({
				add: true,
				fillStyle: {
					color: 0X989898,
					alpha: 1
				}
			}).fillRect(this.translation.x, this.translation.y, 
				this.puzzle.dimensions.width, 
				this.puzzle.dimensions.height);

		this.physics.world.setBounds(this.translation.x, this.translation.y, 
			this.puzzle.dimensions.width, this.puzzle.dimensions.height);

		const itemGroup = this.physics.add.staticGroup();
		const itemFactory = new ItemFactory(this, this.translation);
		this.puzzle.getAllItems().forEach((item) => {
			let group = (!item.interactable()) ? itemGroup : null;
			let img = itemFactory.instantiateItem(item, group, false);

			if (item instanceof Laser) {
				this._addLaserGraphicsFor(item);
			}

			if (item.movable || item.rotatable) {
				this._setupInteractivity(item, img);
			}

			if (!(item instanceof Target)) {
				item.setProperFrame();
			}
		});

		let playerPosition = { x: this.puzzle.player.getPosition().x + this.translation.x,
			y: this.puzzle.player.getPosition().y + this.translation.y };
		let playerImage = this.add.image(playerPosition.x, playerPosition.y, SPRITES.puzzlePlayer.key);
		this.puzzle.player.setImg(playerImage);

		// Handle other input bits
		this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
		this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
		this.keyEsc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

		this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
			gameObject.x = dragX;
			gameObject.y = dragY;
		});
	}

	update() {
		this.handleInput();

		this.puzzleSolver.solve();

		this.puzzle.getLasers().forEach(laser => this._drawLaserPath(this.laserGraphics[laser.key], laser.path));
	}

	/*--PRIVATE */

	/** Checks for rotation buttons and handles the rotation on the game object in question. */
	handleInput() {
		if (this.pointerOverObj && this.pointerOverObj.rotatable) {
			if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
				this.pointerOverObj.rotate(-90);
			} else if (Phaser.Input.Keyboard.JustDown(this.keyD)) {
				this.pointerOverObj.rotate(90);
			}
		}

		// Check if we're quitting
		if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
			if (this.puzzle.valid) {
				this.removeTranslationFromPuzzleItems();
				SceneHelper.transitionToTopDownScene(this, 
					{ 
						dungeon: this.dungeon, 
						puzzle: this.puzzle, 
						thoughtsController: this.thoughtsController 
					});
			} else {
				// TODO: Inform the player why the puzzle currently isn't valid
			}
		}
	}

	/** Helper method. Handles interactivity for the model object and game object.*/
	_setupInteractivity(modelObj, gameObj) {
		gameObj.setInteractive();

		this.mouseOverController.addMouseOver(modelObj);
		
		if (modelObj.movable) {
			this.input.setDraggable(gameObj);
			gameObj.setCollideWorldBounds(true);
		}

		gameObj.on('pointerover', (evt, objects) => {
			this.pointerOverObj = modelObj;
			this.mouseOverController.mouseOver(modelObj.key);
		});

		gameObj.on('pointerout', (evt, objects) => {
			this.pointerOverObj = null;
			this.mouseOverController.mouseOut(modelObj.key);
		});
	}

	/** Helper method. Returns hash indicating how far over and down everything needs to move. */
	getPuzzleTranslation(puzzleDim) {
		let canvasDim = { width: this.sys.canvas.width, height: this.sys.canvas.height };

		if (puzzleDim.width > canvasDim.width || puzzleDim.height > canvasDim.height) {
			throw 'Puzzle size invalid for this canvas! Canvas must be larger to accomodate!';
		}

		return { x: (canvasDim.width - puzzleDim.width) / 2, y: (canvasDim.height - puzzleDim.height) / 2 };
	}

	/** Helper method. Removes translation from all puzzle items. */
	removeTranslationFromPuzzleItems() {
		this.puzzle.getAllItems().concat([this.puzzle.player]).forEach((item) => {
			let newPos = { x: item.getPosition().x - this.translation.x, y: item.getPosition().y - this.translation.y };
			item.setPosition(newPos);

			if (item.constructor.name === 'Laser') {
				item.path.forEach((pnt) => {
					pnt.x -= this.translation.x;
					pnt.y -= this.translation.y;
				})
			}
		});
	}

	/** Helper method. Draws the laser's path onto the scene. */
	_drawLaserPath(laserGraphics, points) {
		laserGraphics.clear();
		for (let i = 0; i < points.length - 1; i++) {
			laserGraphics.strokeLineShape({
				x1: points[i].x,
				y1: points[i].y,
				x2: points[i + 1].x,
				y2: points[i + 1].y
			});
		}
	}

	/** Helper method. Adds laser graphics to this scene for the laser provided.*/
	_addLaserGraphicsFor(laser) {
		this.laserGraphics[laser.key] = this.add.graphics({
			add: true,
			lineStyle: {
				width: 2,
				color: laser.color.val,
				alpha: 1
			}
		});
	}
}