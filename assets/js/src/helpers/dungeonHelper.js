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

		Object.keys(puzzleData.lasers).forEach((laserKey) => {
			let laserData = puzzleData.lasers[laserKey];
			if (typeof laserData.direction === 'string') laserData.direction = Direction.directionFromString(laserData.direction);
			if (typeof laserData.color === 'string') laserData.color = LaserColor.colorFromKey(laserData.color);
			puzzle.addLaser(new Laser(laserData));
		});

		Object.keys(puzzleData.targets).forEach((targetKey) => {
			let targetData = puzzleData.targets[targetKey];
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

		Object.keys(puzzleData.exits).forEach((exitKey) => {
			let exitData = puzzleData.exits[exitKey];
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
			laserPaths: {},
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
				key: laser.key,
				x: laser.getPosition().x * PUZZLE_ROOM_SCALE + padX, 
				y: laser.getPosition().y * PUZZLE_ROOM_SCALE + padY,
				width: 256,
				height: 256,
				color: laser.color,
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
				});
			}
			layout.laserPaths[laser.key] = path;
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

	/** Helper method. Converts puzzle to a room object with the dimensions established in Room. */
	static puzzleToRoom(puzzle, mapName) {
		if (!puzzle.solve()) {
			throw 'Puzzle is not valid! Cannot convert to room!';
		}

		let room = new Room({
			key: puzzle.roomKey,
			puzzleKey: puzzle.key,
			dimensions: { width: puzzle.dimensions.width * PUZZLE_ROOM_SCALE, height: puzzle.dimensions.height * PUZZLE_ROOM_SCALE },
			mapName: mapName
		});

		puzzle.getLasers().forEach((laser) => {
			room.addPuzzleItem(new Laser({
				position: this.puzzlePosToRoomPos(laser.position),
				dimensions: this.puzzleDimToRoomDim(laser.dimensions),
				key: laser.key,
				color: laser.color,
				direction: laser.direction
			}));
		});

		puzzle.getExits().forEach((exit) => {
			room.addPuzzleItem(new Exit({
				position: this.puzzlePosToRoomPos(exit.position),
				dimensions: this.puzzleDimToRoomDim(exit.dimensions),
				color: exit.color,
				direction: exit.direction
			}));
		});

		puzzle.panels.forEach((panel) => {
			room.addPuzzleItem(new PuzzleItem({
				position: this.puzzlePosToRoomPos(panel.position),
				dimensions: this.puzzleDimToRoomDim(panel.dimensions),
				direction: panel.direction
			}));
		});

		puzzle.getTargets().forEach((target) => {
			room.addPuzzleItem(new Target({
				key: target.key,
				position: this.puzzlePosToRoomPos(target.position),
				dimensions: this.puzzleDimToRoomDim(target.dimensions),
				color: target.color,
				lasersStruck: target.lasersStruck
			}));
		});

		puzzle.surfaces.forEach((surface) => {
			room.addPuzzleItem(new Surface({
				position: this.puzzlePosToRoomPos(surface.position),
				dimensions: this.puzzleDimToRoomDim(surface.dimensions),
				type: surface.type,
				direction: surface.direction
			}));
		});

		return room;
	}

	/** Helper method. Converts room to puzzle. */
	static roomToPuzzle(room) {
		let puzzle = new Puzzle({
			key: room.puzzleKey,
			roomKey: room.key
		});

		room.puzzleItems.forEach((item) => {
			let position = this.roomPosToPuzzlePos(item.position);
			let dimensions = this.roomDimToPuzzleDim(item.dimensions);

			if (item instanceof Laser) {
				puzzle.addLaser(new Laser({
					position: position,
					dimensions: dimensions,
					color: item.color,
					direction: item.direction,
					key: item.key
				}));
			} else if (item instanceof Exit) {
				puzzle.addExit(new Exit({
					position: position,
					dimensions: dimensions,
					color: item.color,
					direction: item.direction,
					key: item.key
				}));
			} else if (item instanceof Surface) {
				puzzle.addSurface(new Surface({
					position: position,
					dimensions: dimensions,
					direction: item.direction,
					type: item.type
				}));
			} else if (item instanceof Target) {
				puzzle.addTarget(new Target({
					key: item.key,
					position: position,
					dimensions: dimensions,
					lasersStruck: item.lasersStruck,
					color: item.color
				}));
			} else {
				puzzle.addPanel(new PuzzleItem({
					position: position,
					dimensions: dimensions,
					direction: direction
				}))
			}
		});

		return puzzle;
	}

	/** Helper method. Converts position provided in puzzle dimensions to dimension in room. */
	static puzzlePosToRoomPos(puzzlePos) {
		return { x: puzzlePos.x * PUZZLE_ROOM_SCALE, y: puzzlePos.y * PUZZLE_ROOM_SCALE };
	}

	/** Helper method. Converts the puzzle dimensions to the room dimensions. */
	static puzzleDimToRoomDim(puzzleDim) {
		return { width: puzzleDim.width * PUZZLE_ROOM_SCALE, height: puzzleDim.height * PUZZLE_ROOM_SCALE };
	}

	/** Helper method. Converts position provided in room dimensions to puzzle dimensions. */
	static roomPosToPuzzlePos(roomPos) {
		return { x: roomPos.x / PUZZLE_ROOM_SCALE, y: roomPos.y / PUZZLE_ROOM_SCALE };
	}

	/** Helper method. Converts room dimensions to puzzle dimensions. */
	static roomDimToPuzzleDim(roomDim) { // TODO: Does it handle the padding on the edges?
		return { width: roomDim.width / PUZZLE_ROOM_SCALE, height: roomDim.height / PUZZLE_ROOM_SCALE };
	}
}