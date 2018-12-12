/**
 * laser.js
 *
 * Represents a single laser.
 */
class Laser {
	
	constructor(laserImage, direction) {
		this.img = laserImage;
		this.direction = direction || Laser.DIRECTIONS.EAST;
	}
}

Laser.DIRECTIONS = { EAST: 0, SOUTH: 1, WEST: 2, NORTH: 3 };