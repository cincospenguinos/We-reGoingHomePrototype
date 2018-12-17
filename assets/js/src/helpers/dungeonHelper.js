/**
 * DungeonHelper.js
 *
 * Helper class. Holds static functions that generate the various puzzles.
 */
import { Puzzle } from '../model/puzzle.js';
import { Surface } from '../model/surface.js';
import { Laser } from '../model/laser.js';
import { Exit } from '../model/exit.js';
import { PuzzleItem } from '../model/puzzleItem.js';
import { Dungeon } from '../model/dungeon.js';
import { Player } from '../model/player.js';
import { KEYS, DIRECTION } from '../../lib/CONST.js';

export class DungeonHelper {

	/** Returns list of all the puzzles. */
	static getPuzzleList(scene) {
		let dungeonData = scene.cache.json.get(KEYS.dungeons.key);
		let list = [];

		Object.keys(dungeonData.dungeons).forEach((dungeonKey) => {
			dungeonData.dungeons[dungeonKey].puzzles.forEach((puzzleData) => {
				list.push(puzzleData.key);
			})
		});

		return list;
	}

	/** Generates the dungeon requested. */
	static generateDungeon(scene, dungeonKey) {
		let dungeonData = scene.cache.json.get(KEYS.dungeons.key).dungeons[dungeonKey];

		let dungeon = new Dungeon();
		dungeonData.puzzles.forEach((puzzleData) => {
			let puzzle = this.generatePuzzle(scene, puzzleData);
			dungeon.addPuzzle(puzzleData.key, puzzle);
		});

		return dungeon;
	}

	/** Helper method. Returns a puzzle object with all of the data outlined in the data hash provided. */
	static generatePuzzle(scene, puzzleData) {
		let puzzle = new Puzzle(puzzleData.dimensions.width, puzzleData.dimensions.height);
		puzzle.laser = new Laser({
			direction: this.directionFromString(puzzleData.laser.direction),
			dimensions: puzzleData.laser.dimensions,
			movable: puzzleData.laser.movable,
			rotatable: puzzleData.laser.rotatable,
			position: puzzleData.laser.position
		});

		puzzleData.surfaces.forEach((surfaceData) => {
			puzzle.addSurface(new Surface({
				type: this.surfaceTypeFromString(surfaceData.type),
				isTarget: surfaceData.isTarget,
				reflectiveDirection: this.directionFromString(surfaceData.reflectiveDirection),
				movable: surfaceData.movable,
				rotatable: surfaceData.rotatable,
				position: surfaceData.position,
				dimensions: surfaceData.dimensions,
				direction: this.directionFromString(surfaceData.reflectiveDirection)
			}));
		});

		puzzleData.panels.forEach((panelData) => {
			puzzle.addPanel(new PuzzleItem({
				position: panelData.position,
				dimensions: panelData.dimensions,
				direction: this.directionFromString(panelData.direction)
			}));
		});

		puzzleData.exits.forEach((exitData) => {
			let direction = this.directionFromString(exitData.direction);
			let position = this.getDoorPosition(scene, direction);

			puzzle.addExit(new Exit({
				position: position,
				nextRoomKey: exitData.nextPuzzle,
				direction: direction
			}));
		});

		puzzle.player = new Player({
			position: { x: puzzleData.playerPosition.x, y: puzzleData.playerPosition.y },
			dimensions: { width: 64, height: 64 }
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

		let layout = {};

		layout.laser = {
			direction: puzzle.laser.direction,
			scale: k.x * k.y,
			position: { 
				x: puzzle.laser.getPosition().x * k.x + padX,
				y: puzzle.laser.getPosition().y * k.y + padY
			}
		};

		layout.surfaces = [];
		puzzle.surfaces.forEach((surface) => {
			layout.surfaces.push({
				type: surface.type,
				isTarget: surface.isTarget,
				position: { x: surface.getPosition().x * k.x + padX, y: surface.getPosition().y * k.y + padY },
				scale: k.x * k.y
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

		// TODO: Exits

		// TODO: Player
		layout.player = {
			position: { x: puzzle.player.getPosition().x * k.x, y: puzzle.player.getPosition().y * k.y },
			dimensions: { width: 64, height: 64 }
		};

		return layout;
	}

	/** Helper method. Returns the direction given a direction string. */
	static directionFromString(str) {
		if (str === 'EAST') {
			return DIRECTION.EAST;
		} else if (str === 'SOUTH') {
			return DIRECTION.SOUTH;
		} else if (str === 'WEST') {
			return DIRECTION.WEST;
		} else if (str === 'NORTH') {
			return DIRECTION.NORTH;
		}

		return undefined;
	}

	/** Helper method. Returns the surface type given the string provided. */
	static surfaceTypeFromString(str) {
		if (str === 'OPAQUE') {
			return Surface.OPAQUE;
		} else if (str === 'REFLECTIVE') {
			return Surface.REFLECTIVE;
		}

		throw 'Surface type "' + str + '" is invalid!';
	}

	/** Helper method. gets the door position given the scene and the direction. */
	static getDoorPosition(scene, direction) {
		switch(direction) {
		case DIRECTION.EAST:
			return { x: scene.sys.canvas.width - 8, y: scene.sys.canvas.height / 2 };
		case DIRECTION.SOUTH:
			return { x: scene.sys.canvas.width / 2, y: scene.sys.canvas.height - 8 };
		case DIRECTION.WEST:
			return { x: 8, y: scene.sys.canvas.height / 2 };
		case DIRECTION.NORTH:
			return { x: scene.sys.canvas.width / 2, y: 8 };
		}
	}
}