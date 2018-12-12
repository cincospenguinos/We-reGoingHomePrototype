/**
 * sceneMain.js
 *
 * Main scene for the game.
 */
class SceneMain extends Phaser.Scene {

	constructor() {
		super({ key: 'SceneMain'});

		this.laser = new Laser(this);
		this.surfaces = [ new Surface() ];
	}

	preload() {
		this.load.image('redLaser', 'assets/sprites/red_laser.png');
		this.load.image('opaqueSurface', 'assets/sprites/opaque_surface.png');
	}

	create() {
		let laserImg = this.add.image(50, 50, 'redLaser').setInteractive();
		this.input.setDraggable(laserImg);

		this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
			gameObject.x = dragX;
			gameObject.y = dragY;
		});

		this.laser.setImg(laserImg);

		let opaqueSurface = this.add.image(350, 150, 'opaqueSurface').setInteractive();
		this.input.setDraggable(opaqueSurface);
		this.surfaces[0].setImg(opaqueSurface);


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
		let points = this.laser.getPath(this.surfaces);

		this.graphics.clear();
		for (let i = 0; i < points.length - 1; i++) {
			this.graphics.strokeLineShape({
				x1: points[i].x,
				y1: points[i].y,
				x2: points[i + 1].x,
				y2: points[i + 1].y
			});
		}

		// Handle the graphics
		
		this.graphics.strokeLineShape({ x1: this.laser.img.x, y1: this.laser.img.y, x2: this.laser.img.x + 500, y2: this.laser.img.y});
	}
}