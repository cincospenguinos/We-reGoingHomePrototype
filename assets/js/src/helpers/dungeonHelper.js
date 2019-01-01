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
import { KEYS, COLORS, PUZZLE_ROOM_SCALE } from '../../lib/CONST.js';
import { Direction } from '../model/direction.js';
import { LaserColor } from '../model/laserColor.js';

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
			if (typeof laserData.direction === 'string') laserData.direction = Direction.directionFromString(laserData.direction);
			if (typeof laserData.color === 'string') laserData.color = LaserColor.colorFromKey(laserData.color);
			puzzle.addLaser(new Laser(laserData));
		});

		puzzleData.targets.forEach((targetData) => {
			if (typeof targetData.direction === 'string') targetData.direction = Direction.directionFromString(targetData.direction);
			puzzle.addTarget(new Target(targetData));
		});

		puzzleData.surfaces.forEach((surfaceData) => {
			if (typeof surfaceData.type === 'string' && !Surface.validType(surfaceData.type)) surfaceData.type = Surface.typeFromString(surfaceData.type);
			if (typeof surfaceData.direction === 'string') surfaceData.direction = Direction.directionFromString(surfaceData.direction);
			puzzle.addSurface(new Surface(surfaceData));
		});

		puzzleData.panels.forEach((panelData) => { // NOTE: The panel's direction is used to determine where in the room it is
			if (typeof panelData.direction === 'string') panelData.direction = Direction.directionFromString(panelData.direction);
			puzzle.addPanel(new PuzzleItem(panelData));
		});

		puzzleData.exits.forEach((exitData) => {
			if (typeof exitData.direction === 'string') exitData.direction = Direction.directionFromString(exitData.direction);
			if (typeof exitData.color === 'string') exitData.color = LaserColor.colorFromKey(exitData.color);
			puzzle.addExit(new Exit(exitData));
		});

		puzzle.player = new Player({
			position: { x: puzzleData.playerPosition.x, y: puzzleData.playerPosition.y },
			dimensions: { width: 8, height: 8 }
		});

		return puzzle;
	}

	/** Helper method. Note that room dimensions and puzzle dimensions must differ by a specific factor. */
	static generateTopDownLayout(puzzle, roomDimensions) {
		// First check if the given room's dimensions are valid in relation to the puzzle.
		roomDimensions.width -= (roomDimensions.paddingLeft + roomDimensions.paddingRight);
		roomDimensions.height -= (roomDimensions.paddingTop + roomDimensions.paddingBottom);

		if (puzzle.dimensions.width * PUZZLE_ROOM_SCALE !== roomDimensions.width
			|| puzzle.dimensions.height * PUZZLE_ROOM_SCALE !== roomDimensions.height) {
			throw 'Puzzle dimensions do not match with the room provided!';
		}

		// We need the laser paths, so we're calling solve() on the puzzle to get all the various flags in
		// the states they need to be.
		puzzle.solve();

		let layout = {
			lasers: [],
			laserPaths: [],
			exits: [],
			panels: [],
			surfaces: [],
			targets: [],
			playerPosition: {}
		};

		let padX = roomDimensions.paddingLeft + roomDimensions.paddingRight;
		let padY = roomDimensions.paddingTop + roomDimensions.paddingBottom;

		puzzle.getLasers().forEach((laser) => {
			layout.lasers.push({
				x: laser.getPosition().x * PUZZLE_ROOM_SCALE + padX, 
				y: laser.getPosition().y * PUZZLE_ROOM_SCALE + padY,
				width: 256,
				height: 256,
				direction: laser.direction
			});

			let path = [];
			for (let i = 0; i < laser.path.length - 1; i++) {
				path.push({
					x1: laser.path[i].x * PUZZLE_ROOM_SCALE + padX,
					y1: laser.path[i].y * PUZZLE_ROOM_SCALE + padY,
					x2: laser.path[i + 1].x * PUZZLE_ROOM_SCALE + padX,
					y2: laser.path[i + 1].y * PUZZLE_ROOM_SCALE + padY,
					isHorizontal: laser.path[i].y === laser.path[i + 1].y
				})
			}
			layout.laserPaths.push(path);
		});

		puzzle.getExits().forEach((exit) => {
			let exitData = {
				key: exit.key,
				x: exit.getPosition().x * PUZZLE_ROOM_SCALE + padX,
				y: exit.getPosition().y * PUZZLE_ROOM_SCALE + padY,
				direction: exit.direction,
				nextRoomKey: exit.nextRoomKey,
				isOpen: exit.isOpen
			};

			if (exit.nextRoomPlayerPosition) {
				exitData.nextRoomPlayerPosition = {
					x: exit.nextRoomPlayerPosition.x * PUZZLE_ROOM_SCALE + padX,
					y: exit.nextRoomPlayerPosition.y * PUZZLE_ROOM_SCALE + padY
				}
			}

			layout.exits.push(exitData);
		});

		puzzle.surfaces.forEach((surface) => {
			layout.surfaces.push({
				x: surface.getPosition().x * PUZZLE_ROOM_SCALE + padX,
				y: surface.getPosition().y * PUZZLE_ROOM_SCALE + padY,
				direction: surface.direction,
				type: surface.type
			});
		});

		puzzle.getTargets().forEach((target) => {
			layout.targets.push({
				x: target.getPosition().x * PUZZLE_ROOM_SCALE + padX,
				y: target.getPosition().y * PUZZLE_ROOM_SCALE + padY,
				direction: target.direction,
				isLit: target.isLit()
			})
		});

		puzzle.panels.forEach((panel) => {
			layout.panels.push({
				x: panel.getPosition().x * PUZZLE_ROOM_SCALE + padX, 
				y: panel.getPosition().y * PUZZLE_ROOM_SCALE + padY
			})
		});

		layout.playerPosition = { 
			x: puzzle.player.getPosition().x * PUZZLE_ROOM_SCALE + padX, 
			y: puzzle.player.getPosition().y * PUZZLE_ROOM_SCALE + padY
		};

		return layout;
	}
}