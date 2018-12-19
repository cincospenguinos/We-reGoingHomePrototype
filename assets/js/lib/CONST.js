/**
 * CONST.js
 *
 * Set of constants for the game. Enumerated types, keys, etc.
 */
let spriteDir = 'assets/sprites/';

let dungeonDir = 'assets/data/dungeons/';
export const KEYS = {
	scene: {
		puzzleScene: 'PuzzleScene',
		traverseScene: 'TraverseScene',
		menuScene: 'MenuScene',
		topDownScene: 'TopDownScene'
	},

	dungeon0: { key: 'dungeon0', location: dungeonDir + 'dungeon0.json' }
};

export const SPRITES = {
	// Puzzle-sized sprites
	puzzleLaser: { key: 'puzzleLaser', location: spriteDir + 'puzzle/laser.png', frameWidth: 32, frameHeight: 32 },
	puzzleTarget: { key: 'puzzleTarget', location: spriteDir + 'puzzle/target.png', frameWidth: 32, frameHeight: 32 },
	puzzleMirror: { key: 'puzzleMirror', location: spriteDir + 'puzzle/mirror.png', frameWidth: 16, frameHeight: 16 },
	puzzlePanel: { key: 'puzzlePanel', location: spriteDir + 'puzzle/panel.png' },
	puzzleExit: { key: 'puzzleExit', location: spriteDir + 'puzzle/exit.png' },

	// Room-sized sprites
	roomLaser: { key: 'roomLaser', location: spriteDir + 'room/laser.png', frameWidth: 256, frameHeight: 256 },
	roomTarget: { key: 'roomTarget', location: spriteDir + 'room/target.png', frameWidth: 256, frameHeight: 256 },
	roomMirror: { key: 'roomMirror', location: spriteDir + 'room/mirror.png', frameWidth: 128, frameHeight: 128 },
	roomPanel: { key: 'roomPanel', location: spriteDir + 'room/panel.png', frameWidth: 64, frameHeight: 64 },
	roomExit: { key: 'roomExit', location: spriteDir + 'room/exit.png', frameWidth: 64, frameHeight: 64 },

	// mainCharacter: { key: 'somethingelse', location: spriteDir + 'nameoffile.png' }
	mainCharacter: { key: 'mainCharacter', location: spriteDir + 'mainCharacter.png' },
	background: { key: 'shittyBackground', location: spriteDir + 'shittyBackground.png' },
	panel: { key: 'panel', location: spriteDir + 'panel.png', frameWidth: 32, frameHeight: 32 },
	exit: { key: 'exitButton', location: spriteDir + 'exit.png' },
	topDownDoor: { key: 'topDownDoor', location: spriteDir + 'door.png', frameWidth: 128, frameHeight: 128 }
};

export const DIRECTION = {
	EAST: 0,
	SOUTH: 1,
	WEST: 2,
	NORTH: 3
};

export const COLORS = {
	RED: 0xFF1010
};