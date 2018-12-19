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
	puzzleLaser: { key: 'puzzleLaser', location: spriteDir + 'puzzle/laser.png', frameWidth: 32, frameHeight: 32 },
	roomLaser: { key: 'roomLaser', location: spriteDir + 'room/laser.png' },
	mirror: { key: 'mirror', location: spriteDir + 'mirror.png' },
	opaqueSurface: { key: 'opaqueSurface', location: spriteDir + 'opaqueSurface.png' },
	menuOne: { key: 'menuOne', location: spriteDir + 'one.png' },
	target: { key: 'target', location: spriteDir + 'target.png', frameWidth: 64, frameHeight: 64 },
	completeButton: { key: 'completeButton', location: spriteDir + 'complete.png' },
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