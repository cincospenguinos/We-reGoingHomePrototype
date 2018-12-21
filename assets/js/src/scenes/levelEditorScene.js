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
		this.createInfoPanel();

		// TODO: Setup buttons to insert various things

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
		this.puzzle.solve();
		// TODO: Manage the graphics components for the lasers
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
				$('#puzzle-bounds-tiles').text(this.puzzleBoundsInTiles());
			}).append('<br/>');
		$('#room-width').val(this.puzzle.dimensions.width);

		puzzleInfo.append('<input type="number" id="room-height" step=8 />')
			.on('input', (evt) => {
				this.puzzle.dimensions.height = parseInt($('#room-height').val());
				this.drawPuzzleBounds();
				$('#puzzle-bounds-tiles').text(this.puzzleBoundsInTiles());
			});
		$('#room-height').val(this.puzzle.dimensions.height);
		puzzleInfo.append('<p id="puzzle-bounds-tiles"></p>')
		$('#puzzle-bounds-tiles').text(this.puzzleBoundsInTiles());

		let pieceInfo = editorInfo.append('<div id="puzzle-piece-info"/>'); // For information specific about pieces
		pieceInfo.append('<div>Movable:<input type="checkbox" id="puzzle-piece-movable" /></div>');
		$('#puzzle-piece-movable').change(() => {
			if (this.selectedPiece) {
				this.selectedPiece.movable = $('#puzzle-piece-movable').checked;
			}
		}).append('<br/>');

		pieceInfo.append('<div>Rotatable: <input type="checkbox" id="puzzle-piece-rotatable" /></div>');
		$('#puzzle-piece-rotatable').change(() => {
			if (this.selectedPiece) {
				this.selectedPiece.rotatable = $('#puzzle-piece-rotatable').checked;
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