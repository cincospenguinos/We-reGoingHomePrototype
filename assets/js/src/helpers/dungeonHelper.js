/**
 * DungeonHelper.js
 *
 * Helper class. Holds static functions that generate the various puzzles.
 */
import { Target } from '../model/target.js';
import { Puzzle } from '../model/puzzle.js';
import { Surface } from '../model/surface.js';
import { Laser } from '../model/laser.js';
import { Exit } from '../model/exit.js';
import { PuzzleItem } from '../model/puzzleItem.js';
import { Dungeon } from '../model/dungeon.js';
import { Player } from '../model/player.js';
import { Room } from '../model/room.js';
import { KEYS, COLORS } from '../../lib/CONST.js';
import { Direction } from '../model/direction.js';

export class DungeonHelper {

	/** Returns list of all the puzzles. */
	static getPuzzleList(scene) {
		let dungeonData = scene.cache.json.get('dungeon0');
		let list = [];

		Object.keys(dungeonData.rooms).forEach((roomKey) => {
			list.push(roomKey);
		});

		return list;
	}

	/** Generates the dungeon requested. */
	static generateDungeon(scene, dungeonKey) {
		let dungeonData = scene.cache.json.get('dungeon0');

		let dungeon = new Dungeon();
		Object.keys(dungeonData.rooms).map((k) => { return dungeonData.rooms[k] }).forEach((roomData) => {
			dungeon.addRoom(roomData.key, new Room(roomData));
		});

		return dungeon;
	}

	/** Helper method. Returns a puzzle object with all of the data outlined in the data hash provided. */
	static generatePuzzle(scene, puzzleKey) {
		let puzzleData = scene.cache.json.get('dungeon0')['puzzles'][puzzleKey];

		let puzzle = new Puzzle({
			key: puzzleData.key,
			dimensions: { width: puzzleData.dimensions.width, height: puzzleData.dimensions.height },
			roomKey: puzzleData.roomKey,
		});

		puzzleData.lasers.forEach((laserData) => {
			laserData.direction = Direction.directionFromString(laserData.direction);
			laserData.color = COLORS[laserData.color];
			puzzle.addLaser(new Laser(laserData));
		});

		puzzleData.targets.forEach((targetData) => {
			targetData.direction = Direction.directionFromString(targetData.direction);
			puzzle.addTarget(new Target(targetData));
		});

		puzzleData.surfaces.forEach((surfaceData) => {
			surfaceData.type = Surface.typeFromString(surfaceData.type);
			surfaceData.direction = Direction.directionFromString(surfaceData.direction);
			puzzle.addSurface(new Surface(surfaceData));
		});

		puzzleData.panels.forEach((panelData) => { // NOTE: The panel's direction is used to determine where in the room it is
			panelData.direction = Direction.directionFromString(panelData.direction);
			puzzle.addPanel(new PuzzleItem(panelData));
		});

		puzzleData.exits.forEach((exitData) => {
			exitData.direction = Direction.directionFromString(exitData.direction);
			puzzle.addExit(new Exit(exitData));
		});

		puzzle.player = new Player({
			position: { x: puzzleData.playerPosition.x, y: puzzleData.playerPosition.y },
			dimensions: { width: 8, height: 8 }
		});

		return puzzle;
	}

	/** Helper method. Generates a top down layout with the map dimensions provided. The proper room width and height must be a 4:3 aspect ratio. */
	static generateTopDownLayout(puzzle, roomDimensions) {
		let padX = roomDimensions.paddingLeft + roomDimensions.paddingRight;
		let padY = roomDimensions.paddingTop + roomDimensions.paddingBottom;
		let roomWidth = roomDimensions.width - padX;
		let roomHeight = roomDimensions.height - padY;

		let k = { x: roomWidth / puzzle.dimensions.width, y: roomHeight / puzzle.dimensions.height };
		let scale = k.x * k.y;

		let layout = {};

		layout.laser = {
			direction: puzzle.laser.direction,
			scale: scale,
			position: { 
				x: puzzle.laser.getPosition().x * k.x + padX,
				y: puzzle.laser.getPosition().y * k.y + padY
			}
		};

		layout.surfaces = [];
		puzzle.surfaces.forEach((surface) => {
			layout.surfaces.push({
				type: surface.type,
				direction: surface.direction,
				isTarget: surface.isTarget,
				position: { x: surface.getPosition().x * k.x + padX, y: surface.getPosition().y * k.y + padY },
				scale: scale
			});
		});

		layout.panels = [];
		puzzle.panels.forEach((panel) => {
			let panelPos = panel.getPosition();
			let position = {};

			switch (panel.direction) {
			case DIRECTION.EAST:
				position = { 
					x: panelPos.x * k.x + roomDimensions.paddingRight,
					y: panelPos.y * k.y + padY 
				};
				break;
			case DIRECTION.SOUTH:
				position = { 
					x: panelPos.x * k.x + padX,
					y: panelPos.y * k.y + roomDimensions.paddingBottom 
				};
				break;
			case DIRECTION.WEST:
				position = { 
					x: panelPos.x * k.x - roomDimensions.paddingRight,
					y: panelPos.y * k.y + padY 
				};
				break;
			case DIRECTION.NORTH:
				position = { 
					x: panelPos.x * k.x + padX, 
					y: panelPos.y * k.y + padY
				};
				break;
			}

			layout.panels.push({
				position: position,
				direction: panel.direction
			});
		});

		layout.exits = [];
		puzzle.exits.forEach((exit) => {
			let position;

			switch (exit.direction) {
			case DIRECTION.EAST:
				position = { x: exit.position.x * k.x + 128, y: exit.position.y * k.y + 64 };
				break;
			case DIRECTION.SOUTH:
				position = { x: exit.position.x * k.x + padX, y: exit.position.y * k.y + 64 };
				break;
			case DIRECTION.WEST:
				position = { x: exit.position.x * k.x, y: exit.position.y * k.y + 64 };
				break;
			case DIRECTION.NORTH:
				position = { x: exit.position.x * k.x + padX, y: exit.position.y * k.y + padY - 64 };
				break;
			}

			console.log(exit)

			layout.exits.push({
				direction: exit.direction,
				position: position,
				nextPuzzleKey: exit.nextPuzzleKey
			});
		});

		layout.player = {
			position: { x: puzzle.player.getPosition().x * k.x, y: puzzle.player.getPosition().y * k.y },
			dimensions: { width: 64, height: 64 }
		};

		let laserPath = puzzle.getLaserPath();
		layout.lines = [];

		for (let i = 0; i < laserPath.length - 1; i++) {
			let pt1 = laserPath[i];
			let pt2 = laserPath[i + 1];

			layout.lines.push({
				x1: pt1.x * k.x + padX,
				y1: pt1.y * k.y + padY,
				x2: pt2.x * k.x + padX,
				y2: pt2.y * k.y + padY,
				horizontal: pt1.y === pt2.y
			});
		}

		return layout;
	}
}