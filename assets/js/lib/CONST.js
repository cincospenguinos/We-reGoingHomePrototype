/**
 * CONST.js
 *
 * Set of constants for the game. Enumerated types, keys, etc.
 */
let spriteDir = 'assets/sprites/';
export const KEYS = {
	scene: {
		puzzleScene: 'PuzzleScene',
		transverseScene: 'TransverseScene',
		menuScene: 'MenuScene'
	},

	sprites: {
		laser: { key: 'laser', location: spriteDir + 'redLaser.png' },
		mirror: { key: 'mirror', location: spriteDir + 'mirror.png' },
		opaqueSurface: { key: 'opaqueSurface', location: spriteDir + 'opaqueSurface.png' },
		menuOne: { key: 'menuOne', location: spriteDir + 'one.png' },
		target: { key: 'target', location: spriteDir + 'target.png', animations: {
			lit: { key: 'lit', indexes: [1, 1] },
			unlit: { key: 'unlit', indexes: [0, 0] }
		}},
		completeButton: { key: 'completeButton', location: spriteDir + 'complete.png' }
	}
};

export const DIRECTION = {
	EAST: 0,
	SOUTH: 1,
	WEST: 2,
	NORTH: 3
};