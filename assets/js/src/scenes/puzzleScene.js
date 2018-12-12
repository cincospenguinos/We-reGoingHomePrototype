/**
 * puzzleScene.js
 *
 * Scene for the puzzle component of the game.
 */
import { KEYS } from '../../lib/CONST.js';

export class PuzzleScene extends Phaser.Scene {

	constructor() {
		super({ key: KEYS.scene.puzzleScene });
	}

	preload() {
		this.puzzle = new Puzzle(this.sys.game.canvas.width, this.sys.game.canvas.height);

		this.load.image('redLaser', 'assets/sprites/redLaser.png');
		this.load.image('opaqueSurface', 'assets/sprites/opaqueSurface.png');
		this.load.image('mirrorSurface', 'assets/sprites/mirror.png')
	}

	create() {
		let laserImage = this.add.image(this.sys.game.canvas.width / 4, 
			this.sys.game.canvas.height / 4, 'redLaser').setInteractive();
		this.input.setDraggable(laserImage);
		this.puzzle.laser = new Laser(laserImage);

		let opaqueSurface = this.add.image(this.sys.game.canvas.width / 3, 2 * this.sys.game.canvas.height / 3, 'opaqueSurface').setInteractive();
		this.input.setDraggable(opaqueSurface);
		this.puzzle.addSurface(opaqueSurface, Surface.OPAQUE);

		let mirrorSurface = this.add.image(3 * this.sys.game.canvas.width / 4, this.sys.game.canvas.height / 2, 'mirrorSurface').setInteractive();
		this.input.setDraggable(mirrorSurface);
		this.puzzle.addSurface(mirrorSurface, Surface.REFLECTIVE);

		this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
			gameObject.x = dragX;
			gameObject.y = dragY;
		});

		this.graphics = this.add.graphics({
			add: true,
			lineStyle: {
				width: 1,
				color: 0xFF0000,
				alpha: 1
			}
		});
	}

	update() {
		// TODO: Calculate some things


		let points = this.puzzle.getLaserPath();

		this.graphics.clear();
		for (let i = 0; i < points.length - 1; i++) {
			this.graphics.strokeLineShape({
				x1: points[i].x,
				y1: points[i].y,
				x2: points[i + 1].x,
				y2: points[i + 1].y
			});
		}
	}
}