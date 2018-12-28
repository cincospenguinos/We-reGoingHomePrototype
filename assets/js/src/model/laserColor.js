/**
 * laserColor.js
 *
 * Class representing a color for a given laser. Every class that relies on a color will use one of these.
 */
export class LaserColor {
	constructor(key, colorVal) {
		this.key = key;
		this.val = colorVal;
	}
}

LaserColor.RED = new LaserColor('l-red', 0xFF1010);
LaserColor.GREEN = new LaserColor('l-green', 0x10FF10);
LaserColor.BLUE = new LaserColor('l-blue', 0x1010FF);