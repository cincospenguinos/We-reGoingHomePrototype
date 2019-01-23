/**
 * doorsController.js
 *
 * Controls the doors in the TopDownScene. Handles setting the open/closed state,
 * managing various pieces like that.
 *
 * At least I think it should. We'll find out how well this pans out.
 */
import { Exit } from '../model/exit.js';
import { Direction } from '../model/direction.js';

export class DoorsController {
	constructor(scene) {
		this.scene = scene;
	}

	/** Makes all of the exits show up properly in TopDownScene. Returns collection of zones with correct data. */
	presentProperExits(doorLayer, room) {
		let zones = [];
		room.getExits().forEach((exit) => {
			let worldPos = exit.getPosition();
			let worldDim = exit.getDimensions();
			let doorTiles = doorLayer.getTilesWithinWorldXY(worldPos.x, worldPos.y, 
				worldDim.width, worldDim.height);

			if (!this._validDoorTiles(doorTiles, exit)) {
				throw 'Incorrect number of door tiles for exit!';
			}

			// Now that we have the exit and door tiles as needed, we can go ahead and update the tiles accordingly
			doorTiles.forEach((tile) => {
				let newTileIndex = this._tileIndexMatching(exit, tile.properties.quadrant, doorLayer.tileset[0]);
				doorLayer.putTileAt(newTileIndex, tile.x, tile.y);
			});

			if (exit.isOpen) {
				const zoneOffset = this._getZoneOffset(exit.direction, worldDim, worldPos);
				const zone = this.scene.add.zone(zoneOffset.x, zoneOffset.y, zoneOffset.width, zoneOffset.height);
				zone.setData({
					key: exit.key,
					nextRoom: exit.nextRoomKey,
				})

				zones.push(zone);
			}
		});

		return zones;
	}

	/*-- PRIVATE METHODS */

	/** Helper method. Returns proper dimensions for zone given exit of the direction, dimensions, and top-left coordinate pos*/
	_getZoneOffset(direction, dimensions, pos) {
		let offset = { width: dimensions.width, height: dimensions.height };
		switch(direction) {
		case Direction.SOUTH:
			offset.x = pos.x + dimensions.width / 2;
			offset.y = pos.y + 2 * dimensions.height / 3;
			break;
		case Direction.EAST:
		case Direction.NORTH:
		case Direction.WEST:
			offset.x = pos.x;
			offset.y = pos.y
			break;
		}
		return offset;
	}

	/** Helper method. Ensures that the door tiles collected match the exit associated. */
	_validDoorTiles(tiles, exit) {
		switch(exit.direction) {
		case Direction.NORTH:
		case Direction.SOUTH:
			return tiles.length === 4;
		case Direction.EAST:
		case Direction.WEST:
			return tiles.length === 2;
		}
	}

	/** Helper method. Returns the proper tile in the tilesheet given the exit, what quadrant, and the tilesheet. */
	_tileIndexMatching(exit, quadrant, tileset) {
		let props = { quadrant: quadrant };
		props.direction = Direction.stringFromDirection(exit.direction);
		props.color = exit.color.toString();
		props.isOpen = exit.isOpen;
		return this._getTileIndexFor(props, tileset);
	}

	/** Helper method. Returns the tile in the tileset matching the properties provided. */
	_getTileIndexFor(props, tileset) {
		let tiles = Object.keys(tileset.tileProperties).map((idx) => { 
			return { index: parseInt(idx), props: tileset.tileProperties[idx] }
		})
		.filter(obj => obj.props.quadrant === props.quadrant)
		.filter(obj => obj.props.color === props.color)
		.filter(obj => obj.props.isOpen === props.isOpen)
		.filter(obj => obj.props.direction === props.direction);

		if (tiles.length !== 1) { throw 'No tile found for props!'; }

		return tileset.firstgid + tiles[0].index;
	}
}