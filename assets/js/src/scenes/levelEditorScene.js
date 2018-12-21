/**
 * levelEditorScene.js
 *
 * Level editor for the game. This will make dungeon design so much easier.
 */
import { SPRITES, KEYS } from '../../lib/CONST.js';
import { SceneHelper } from '../helpers/sceneHelper.js'
import { Puzzle } from '../model/puzzle.js';

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
		// TODO: Create the set of panels and things
		this.createInfoPanel();
		
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
		// TODO: Manage the graphics components for the laser
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
			}).append('<br/>');
		$('#room-width').val(this.puzzle.dimensions.width);

		puzzleInfo.append('<input type="number" id="room-height" step=8 />')
			.on('input', (evt) => {
				this.puzzle.dimensions.height = parseInt($('#room-height').val());
				this.drawPuzzleBounds();
			});
		$('#room-height').val(this.puzzle.dimensions.height);
	}

	/** Helper method. Draws the puzzle's boundaries. */
	drawPuzzleBounds() {
		this.boundariesGraphics.clear();
		this.boundariesGraphics.fillRect(0, 0, this.puzzle.dimensions.width, this.puzzle.dimensions.height);
	}
}