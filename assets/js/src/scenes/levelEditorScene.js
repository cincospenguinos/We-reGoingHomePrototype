/**
 * levelEditorScene.js
 *
 * Level editor for the game. This will make dungeon design so much easier.
 */
import { SPRITES, KEYS } from '../../lib/CONST.js';
import { SceneHelper } from '../helpers/sceneHelper.js'
import { Puzzle } from '../model/puzzle.js';
import { Laser } from '../model/laser.js';
import { Surface } from '../model/surface.js';
import { Target } from '../model/target.js';
import { Exit } from '../model/exit.js';
import { PuzzleItem } from '../model/puzzleItem.js';
import { Direction } from '../model/direction.js';

export class LevelEditorScene extends Phaser.Scene {
	constructor() {
		super({ key: KEYS.scene.levelEditorScene });
	}

	init() {
		this.puzzle = new Puzzle({
			key: 'PUZZLE_KEY',
			dimensions: { width: 136, height: 136 },
			roomKey: 'ROOM_KEY'
		});

		this.laserGraphics = {};
		this.incrementingKey = 0;
	}

	preload() {
		SceneHelper.loadSpritesheet(this, SPRITES.puzzleLaser);
		SceneHelper.loadSpritesheet(this, SPRITES.puzzleTarget);
		SceneHelper.loadSpritesheet(this, SPRITES.puzzleMirror);
		SceneHelper.loadImage(this, SPRITES.puzzlePanel);
		SceneHelper.loadImage(this, SPRITES.puzzleExit);
		SceneHelper.loadImage(this, SPRITES.puzzlePlayer);
		SceneHelper.loadImage(this, SPRITES.closePanelButton);
	}

	create() {
		this.createInfoPanel();

		this.validKeys = {
			addLaser: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
			addTarget: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T),
			addMirror: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M),
			addPanel: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P),
			addExit: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
			rotateClockwise: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
			rotateCounterClockwise: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
		};

		this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
			gameObject.x = dragX;
			gameObject.y = dragY;
		});

		this.input.on('pointerdown', (a, b) => {
			let position = { x: this.input.mousePointer.position.x, y: this.input.mousePointer.position.y };

			if (position.x > this.puzzle.dimensions.width && position.y > this.puzzle.dimensions.height) {
				this.deselectPiece();
			}
		});

		// TODO: Draw the puzzle
		this.boundariesGraphics = this.add.graphics({
				add: true,
				fillStyle: {
					color: 0X989898,
					alpha: 1
				}
			});
		this.drawPuzzleBounds();
	}

	update() {
		this.handleInput();

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

	/** Helper method. Handles the input. */
	handleInput() {
		let keyboard = Phaser.Input.Keyboard;
		if (!this.selectedPiece) {

			let position = { x: this.input.mousePointer.position.x, y: this.input.mousePointer.position.y };

			// If it's outside the puzzle boundaries, don't even bother
			if (position.x > this.puzzle.dimensions.width || position.y > this.puzzle.dimensions.height) {
				return;
			}

			if (keyboard.JustDown(this.validKeys.addLaser)) {
				let laser = new Laser({
					key: this.newKey('laser'),
					position: position,
					dimensions: { width: 32, height: 32},
					exitKeys: [],
					direction: Direction.EAST
				});

				let img = this.physics.add.image(position.x, position.y, SPRITES.puzzleLaser.key);
				laser.setImg(img);

				this.setupInteractive(laser);

				this.puzzle.addLaser(laser);
				this.setSelectedPiece(laser);

				this.laserGraphics[laser.key] = this.add.graphics({
					add: true,
					lineStyle: {
						width: 1,
						color: 0xFF1010,
						alpha: 1
					}
				});
			} else if (keyboard.JustDown(this.validKeys.addTarget)) {
				let target = new Target({
					key: this.newKey('target'),
					position: position,
					dimensions: { width: 32, height: 32},
					direction: Direction.EAST
				});

				let img = this.physics.add.image(position.x, position.y, SPRITES.puzzleTarget.key);
				target.setImg(img);

				this.setupInteractive(target);

				this.puzzle.addTarget(target);
				this.setSelectedPiece(target);
			} else if (keyboard.JustDown(this.validKeys.addMirror)) {

			} else if (keyboard.JustDown(this.validKeys.addPanel)) {

			} else if (keyboard.JustDown(this.validKeys.addExit)) {

			}
		} else {
			if (keyboard.JustDown(this.validKeys.rotateClockwise)) {
				this.selectedPiece.rotate(90);
			} else if (keyboard.JustDown(this.validKeys.rotateCounterClockwise)) {
				this.selectedPiece.rotate(-90);
			}
		}
	}

	newKey(str) {
		str += this.incrementingKey;
		this.incrementingKey++;
		return str;
	}

	/** Helper method. Sets interactive elements. */
	setupInteractive(puzzleObj) {
		puzzleObj.img.setInteractive();
		puzzleObj.img.setCollideWorldBounds(true);
		this.input.setDraggable(puzzleObj.img);

		puzzleObj.img.on('pointerdown', (evt, objs) => {
			this.setSelectedPiece(puzzleObj);
		});
	}

	/** Helper method. Sets the selected piece. */
	setSelectedPiece(puzzlePiece) {
		this.selectedPiece = puzzlePiece;

		$('#puzzle-piece-movable').prop('checked', this.selectedPiece.movable);
		$('#puzzle-piece-rotatable').prop('checked', this.selectedPiece.rotatable);

		$('#puzzle-piece-info').show();
	}

	deselectPiece() {
		this.selectedPiece = null;
		$('#puzzle-piece-info').hide();
	}

	/** Helper method. Uses jQuery to create the info panel that will be used to modify the various pieces of things. */
	createInfoPanel() {
		let editorInfo = $('<div/>').appendTo($(document.body));
		let puzzleInfo = editorInfo.append('<div/>');
		puzzleInfo.append('<input type="text" id="puzzle-key" />')
			.on('input', (evt) => {
				this.puzzle.key = $('#puzzle-key').val();
			}).append('<br/>');
		$('#puzzle-key').val(this.puzzle.key);

		puzzleInfo.append('<input type="text" id="room-key" />')
			.on('input', (evt) => {
				this.puzzle.roomKey = $('#room-key').val();
			}).append('<br/>');
		$('#room-key').val(this.puzzle.roomKey);

		puzzleInfo.append('<input type="number" id="room-width" step="8" />')
			.on('input', (evt) => {
				this.puzzle.dimensions.width = parseInt($('#room-width').val());
				this.drawPuzzleBounds();
				this.physics.world.setBounds(0, 0, this.puzzle.dimensions.width, this.puzzle.dimensions.height);
				$('#puzzle-bounds-tiles').text(this.puzzleBoundsInTiles());
			}).append('<br/>');
		$('#room-width').val(this.puzzle.dimensions.width);

		puzzleInfo.append('<input type="number" id="room-height" step=8 />')
			.on('input', (evt) => {
				this.puzzle.dimensions.height = parseInt($('#room-height').val());
				this.drawPuzzleBounds();
				this.physics.world.setBounds(0, 0, this.puzzle.dimensions.width, this.puzzle.dimensions.height);
				$('#puzzle-bounds-tiles').text(this.puzzleBoundsInTiles());
			});
		$('#room-height').val(this.puzzle.dimensions.height);
		puzzleInfo.append('<p id="puzzle-bounds-tiles"></p>')
		$('#puzzle-bounds-tiles').text(this.puzzleBoundsInTiles());

		let pieceInfo = $('<div id="puzzle-piece-info"/>').appendTo(editorInfo); // For information specific about pieces
		pieceInfo.append('<div>Movable:<input type="checkbox" id="puzzle-piece-movable" /></div>');
		$('#puzzle-piece-movable').change(() => {
			if (this.selectedPiece) {
				this.selectedPiece.movable = $('#puzzle-piece-movable').is(':checked');
			}
		}).append('<br/>');

		pieceInfo.append('<div>Rotatable: <input type="checkbox" id="puzzle-piece-rotatable" /></div>');
		$('#puzzle-piece-rotatable').change(() => {
			if (this.selectedPiece) {
				this.selectedPiece.rotatable = $('#puzzle-piece-rotatable').is(':checked');
			}
		}).append('<br/>');

		$('#puzzle-piece-info').hide();
	}

	/** Helper method. Draws the puzzle's boundaries. */
	drawPuzzleBounds() {
		this.boundariesGraphics.clear();
		this.boundariesGraphics.fillRect(0, 0, this.puzzle.dimensions.width, this.puzzle.dimensions.height);
	}

	/** Helper method. Returns text of the dimensions in tiles of this pzuzle. */
	puzzleBoundsInTiles() {
		return this.puzzle.dimensions.width / 8 + 'x' + this.puzzle.dimensions.height / 8;
	}
}