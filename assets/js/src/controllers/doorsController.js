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

	/** Returns array of exits given the door layer provided. */
	generateExitsFrom(doorLayer, room, tilesheet) {
		// TODO: We want a whole bunch of exit objects from which we can attach other pieces of information.
		
		// Okay, so the plan is this:
		// 1) We will take a position from the dungeon data info and use it to expect where a door should be
		// 2) We will use that position to extract all of the tiles associated with the exit (there's a function that does this)
		// 3) We will then take those tiles and update them according to the Exit object found in room

		// The only other thing we may need to worry about is transitioning from one room to another. I think this
		// class should handle that logic, since it handles all of the exit information. It should have the ability
		// to draw zones though, which really falls inside the pervue of TopDownScene. That's something we should explore.

		room.getExits().forEach((exit) => {
			let worldPos = exit.getPosition();
			let worldDim = exit.getDimensions();
			let doorTiles = doorLayer.getTilesWithinWorldXY(worldPos.x, worldPos.y, worldDim.width, worldDim.height)
				.filter((tile) => tile.properties.isDoor);

			if (doorTiles.length !== 4) {
				throw 'Incorrect number of door tiles for exit!';
			}

			// At this point, we have the proper tiles associated with the data we need. We will now make the tiles
			// match the room's data. So let's handle that:
			// NOTE: We're going to find the index of the top left tile, and then use that information to set the other
			// NOTE: tiles. This will change when we have a different tilesheet.

			let topLeftTile = 0;

			// TODO: Determine if it's open or not
			if (exit.isOpen) {

			} else {

			}

			// TODO: Get the proper direction
			switch(exit.direction) {
			case Direction.EAST:
				break;
			case Direction.SOUTH:
				break;
			case Direction.WEST:
				break;
			case Direction.NORTH:
				break;
			}

			// TODO: Get the proper color
		});

		return [];
	}
}