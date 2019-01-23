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
import { Thought } from '../model/thought.js';
import { Panel } from '../model/panel.js';

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
			let puzzleItems = []
			roomData.puzzleItems.forEach((itemData) => {
				puzzleItems.push(this.instantiatePuzzleItem(itemData));
			});
			roomData.puzzleItems = puzzleItems;
			roomData.player = new Player(roomData.player);

			let thoughts = [];
			roomData.thoughts.forEach((thoughtData) => {
				thoughtData.type = Thought.stringToType(thoughtData.type);
				thoughts.push(new Thought(thoughtData));
			});
			roomData.thoughts = thoughts;

			dungeon.addRoom(roomData.key, new Room(roomData));
		});

		return dungeon;
	}

	/** Helper method. Converts puzzle to a room object with the dimensions established in Room. */
	static puzzleToRoom(puzzle) {
		if (!puzzle.solve()) {
			throw 'Puzzle is not valid! Cannot convert to room!';
		}

		let room = new Room({
			key: puzzle.roomKey,
			puzzleKey: puzzle.key,
			dimensions: { width: puzzle.dimensions.width * PUZZLE_ROOM_SCALE, height: puzzle.dimensions.height * PUZZLE_ROOM_SCALE },
			mapName: puzzle.mapName,
			thoughts: puzzle.thoughts
		});

		puzzle.getLasers().forEach((laser) => {
			room.addPuzzleItem(new Laser({
				position: this.puzzlePosToRoomPos(laser.getPosition()),
				dimensions: this.puzzleDimToRoomDim(laser.dimensions),
				key: laser.key,
				color: laser.color,
				direction: laser.direction,
				path: laser.path.map((pnt) => { return { x: pnt.x * PUZZLE_ROOM_SCALE, y: pnt.y * PUZZLE_ROOM_SCALE }}),
				movable: laser.movable,
				rotatable: laser.rotatable
			}));
		});

		puzzle.getExits().forEach((exit) => {
			room.addPuzzleItem(new Exit({
				key: exit.key,
				position: this.puzzlePosToRoomPos(exit.getPosition()),
				dimensions: this.puzzleDimToRoomDim(exit.dimensions),
				color: exit.color,
				direction: exit.direction,
				isOpen: exit.isOpen
			}));
		});

		puzzle.panels.forEach((panel) => {
			room.addPuzzleItem(new Panel({
				position: this.puzzlePosToRoomPos(panel.getPosition()),
				dimensions: this.puzzleDimToRoomDim(panel.dimensions),
				direction: panel.direction
			}));
		});

		puzzle.getTargets().forEach((target) => {
			room.addPuzzleItem(new Target({
				key: target.key,
				position: this.puzzlePosToRoomPos(target.getPosition()),
				dimensions: this.puzzleDimToRoomDim(target.dimensions),
				color: target.color,
				lasersStruck: target.lasersStruck
			}));
		});

		puzzle.surfaces.forEach((surface) => {
			room.addPuzzleItem(new Surface({
				position: this.puzzlePosToRoomPos(surface.getPosition()),
				dimensions: this.puzzleDimToRoomDim(surface.dimensions),
				type: surface.type,
				direction: surface.direction,
				movable: surface.movable,
				rotatable: surface.rotatable
			}));
		});

		room.player = new Player({
			position: this.puzzlePosToRoomPos(puzzle.player.getPosition()),
			dimensions: this.puzzleDimToRoomDim(puzzle.player.dimensions)
		});

		return room;
	}

	/** Helper method. Converts room to puzzle. */
	static roomToPuzzle(room) {
		let puzzle = new Puzzle({
			key: room.puzzleKey,
			roomKey: room.key,
			dimensions: { width: room.dimensions.width / PUZZLE_ROOM_SCALE, height: room.dimensions.height / PUZZLE_ROOM_SCALE },
			mapName: room.mapName,
			thoughts: room.thoughts
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
					key: item.key,
					movable: item.movable,
					rotatable: item.rotatable
				}));
			} else if (item instanceof Exit) {
				puzzle.addExit(new Exit({
					position: position,
					dimensions: dimensions,
					color: item.color,
					direction: item.direction,
					key: item.key,
					isOpen: item.isOpen,
				}));
			} else if (item instanceof Surface) {
				puzzle.addSurface(new Surface({
					position: position,
					dimensions: dimensions,
					direction: item.direction,
					type: item.type,
					movable: item.movable,
					rotatable: item.rotatable
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
				puzzle.addPanel(new Panel({
					position: position,
					dimensions: dimensions,
					direction: item.direction
				}))
			}
		});

		puzzle.setPlayer(new Player({
			position: this.roomPosToPuzzlePos(room.player.getPosition()),
			dimensions: this.roomDimToPuzzleDim(room.player.dimensions)
		}));

		return puzzle;
	}

	/** Helper method. Converts position provided in puzzle dimensions to dimension in room. */
	static puzzlePosToRoomPos(puzzlePos) {
		return puzzlePos ? { x: puzzlePos.x * PUZZLE_ROOM_SCALE, y: puzzlePos.y * PUZZLE_ROOM_SCALE } : null;
	}

	/** Helper method. Converts the puzzle dimensions to the room dimensions. */
	static puzzleDimToRoomDim(puzzleDim) {
		return puzzleDim ? { width: puzzleDim.width * PUZZLE_ROOM_SCALE, height: puzzleDim.height * PUZZLE_ROOM_SCALE } : null;
	}

	/** Helper method. Converts position provided in room dimensions to puzzle dimensions. */
	static roomPosToPuzzlePos(roomPos) {
		return { x: roomPos.x / PUZZLE_ROOM_SCALE, y: roomPos.y / PUZZLE_ROOM_SCALE };
	}

	/** Helper method. Converts room dimensions to puzzle dimensions. */
	static roomDimToPuzzleDim(roomDim) {
		return { width: roomDim.width / PUZZLE_ROOM_SCALE, height: roomDim.height / PUZZLE_ROOM_SCALE };
	}

	/** Helper method. Instantiates a puzzle item given some item data. Determines type.*/
	static instantiatePuzzleItem(itemData) {
		if (!itemData.class) {
			throw 'No class associated with itemData. Key was "' + itemData.key + '".'
		}

		if (itemData.color) itemData.color = LaserColor.colorFromKey(itemData.color);
		if (itemData.direction) itemData.direction = Direction.directionFromString(itemData.direction);
		if (itemData.type) itemData.type = Surface.typeFromString(itemData.type);

		switch(itemData.class) {
			case 'Exit':
				return new Exit(itemData);
			case 'Laser':
				return new Laser(itemData);
			case 'Surface':
				return new Surface(itemData);
			case 'Target':
				return new Target(itemData);
			default:
				return new PuzzleItem(itemData);
		}
	}
}