/**
 * topDownScene.js
 *
 * Scene to manage a top-down scrolling view. Mostly for experimentation.
 */
import { KEYS } from '../../lib/CONST.js';

export class TopDownScene extends Phaser.Scene {

	constructor() {
		super({ key: KEYS.scene.topDownScene });
	}

	init(data) {

	}

	preload() {
		this.load.image('tiles', 'assets/sprites/tilesheet.png');
		this.load.tilemapTiledJSON('sandboxMap', 'assets/data/maps/sandbox.json');
	}

	create() {
		let sandboxMap = this.make.tilemap({ key: 'sandboxMap', tileWidth: 32, tileHeight: 32 });

		const tileset = sandboxMap.addTilesetImage('tilesheet', 'tiles');

		const floorLayer = sandboxMap.createStaticLayer('FloorLayer', tileset, 0, 0);
		const wallLayer = sandboxMap.createStaticLayer('WallLayer', tileset, 0, 0);
		const doorLayer = sandboxMap.createStaticLayer('DoorLayer', tileset, 0, 0);

		// And now the camera
		this.cameras.main.setBounds(0, 0, sandboxMap.widthInPixels, sandboxMap.heightInPixels);

		var cursors = this.input.keyboard.createCursorKeys();

	    var controlConfig = {
	        camera: this.cameras.main,
	        left: cursors.left,
	        right: cursors.right,
	        up: cursors.up,
	        down: cursors.down,
	        speed: 0.5
	    };

	    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
	}

	update(time, delta) {
		this.controls.update(delta)
	}
}