/**
 * CONST.js
 *
 * Set of constants for the game. Enumerated types, keys, etc.
 */
let spriteDir = 'assets/sprites/';

let puzzleDir = 'assets/js/src/data/'
export const KEYS = {
	scene: {
		puzzleScene: 'PuzzleScene',
		traverseScene: 'TraverseScene',
		menuScene: 'MenuScene'
	},

	puzzles: { key: 'puzzles', location: puzzleDir + 'puzzles.json' }
};

export const SPRITES = {
	laser: { key: 'laser', location: spriteDir + 'redLaser.png' },
	mirror: { key: 'mirror', location: spriteDir + 'mirror.png' },
	opaqueSurface: { key: 'opaqueSurface', location: spriteDir + 'opaqueSurface.png' },
	menuOne: { key: 'menuOne', location: spriteDir + 'one.png' },
	target: { key: 'target', location: spriteDir + 'target.png', frameWidth: 64, frameHeight: 64 },
	completeButton: { key: 'completeButton', location: spriteDir + 'complete.png' },
	// mainCharacter: { key: 'somethingelse', location: spriteDir + 'nameoffile.png' }
	mainCharacter: { key: 'theguy', location: spriteDir + 'guy.png' },
	background: { key: 'shittyBackground', location: spriteDir + 'shittyBackground.png' },
	panel: { key: 'panel', location: spriteDir + 'panel.png', frameWidth: 16, frameHeight: 32 },
	exit: { key: 'exitButton', location: spriteDir + 'exit.png' }
};

export const PUZZLES = {
	puzzle0: { key: 'puzzle0' }
};

export const DIRECTION = {
	EAST: 0,
	SOUTH: 1,
	WEST: 2,
	NORTH: 3
};