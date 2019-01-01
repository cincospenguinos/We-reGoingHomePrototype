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

	/** Returns color given the key of a color. This helps us ensure that there is one and only one laser color per color. */
	static colorFromKey(key) {
		switch(key) {
		case 'l-red':
			return LaserColor.RED;
		case 'l-green':
			return LaserColor.GREEN;
		case 'l-blue':
			return LaserColor.BLUE;
		case 'l-orange':
			return LaserColor.ORANGE;
		case 'l-purple':
			return LaserColor.PURPLE;
		case 'l-yellow':
			return LaserColor.YELLOW;
		case 'l-white':
			return LaserColor.WHITE;
		default:
			throw 'Invalid color key "' + key + '"!';
		}
	}

	/** Returns color blended by other colors. */
	static blend(colors) {
		let red = false;
		let green = false;
		let blue = false;

		colors.forEach((c) => {
			if (c === LaserColor.RED) {
				red = true;
			} else if (c === LaserColor.GREEN) {
				green = true;
			} else if (c === LaserColor.BLUE) {
				blue = true;
			}
		});

		let blend = 0;

		if (red) blend += 1;
		if (green) blend += 2;
		if (blue) blend += 4;

		switch(blend) {
		case 1:
			return LaserColor.RED;
		case 2:
			return LaserColor.GREEN;
		case 3:
			return LaserColor.ORANGE;
		case 4:
			return LaserColor.BLUE;
		case 5:
			return LaserColor.PURPLE;
		case 6:
			return LaserColor.YELLOW;
		case 7:
			return LaserColor.WHITE;
		case 0:
			throw 'Invalid color blend collection!';
		}
	}
}

LaserColor.RED = new LaserColor('l-red', 0xFF1010);
LaserColor.GREEN = new LaserColor('l-green', 0x10FF10);
LaserColor.BLUE = new LaserColor('l-blue', 0x1010FF);
LaserColor.ORANGE = new LaserColor('l-orange', 0xFF8000);
LaserColor.PURPLE = new LaserColor('l-purple', 0xBB33FF);
LaserColor.YELLOW = new LaserColor('l-yellow', 0xFFFF33);
LaserColor.WHITE = new LaserColor('l-white', 0xFFFFFF);