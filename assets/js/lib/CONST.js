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
		topDownScene: 'TopDownScene',
		levelEditorScene: 'LevelEditorScene'
	},

	dungeon0: { key: 'dungeon0', location: dungeonDir + 'dungeon0.json' },
	thoughts: { key: 'thoughts', location: 'assets/data/thoughts.json' }
};

export const SPRITES = {
	// Puzzle-sized sprites
	puzzleLaser: { key: 'puzzleLaser', location: spriteDir + 'puzzle/laser.png', frameWidth: 64, frameHeight: 64 },
	puzzleTarget: { key: 'puzzleTarget', location: spriteDir + 'puzzle/target.png', frameWidth: 64, frameHeight: 64 },
	puzzleMirror: { key: 'puzzleMirror', location: spriteDir + 'puzzle/mirror.png', frameWidth: 32, frameHeight: 32 },
	puzzlePanel: { key: 'puzzlePanel', location: spriteDir + 'puzzle/panel.png', frameWidth: 16, frameHeight: 16 },
	puzzleExit: { key: 'puzzleExit', location: spriteDir + 'puzzle/exit.png', frameWidth: 32, frameHeight: 32 },
	puzzlePlayer: { key: 'puzzlePlayer', location: spriteDir + 'puzzle/player.png' },
	closePanelButton: { key: 'closePanelButton', location: spriteDir + 'puzzle/closePanelButton.png' },

	// Room-sized sprites
	roomLaser: { key: 'roomLaser', location: spriteDir + 'room/laser.png', frameWidth: 256, frameHeight: 256 },
	roomTarget: { key: 'roomTarget', location: spriteDir + 'room/target.png', frameWidth: 256, frameHeight: 256 },
	roomMirror: { key: 'roomMirror', location: spriteDir + 'room/mirror.png', frameWidth: 128, frameHeight: 128 },
	roomPanel: { key: 'roomPanel', location: spriteDir + 'room/panel.png', frameWidth: 64, frameHeight: 64 },
	roomExit: { key: 'roomExit', location: spriteDir + 'room/exit.png', frameWidth: 128, frameHeight: 128 },
	roomPlayer: { key: 'roomPlayer', location: spriteDir + 'room/player.png', frameWidth: 64, frameHeight: 64 },

	mainCharacter: { key: 'mainCharacter', location: spriteDir + 'mainCharacter.png' },

	// Tilesheet shit
	malkhutTilesheet: { key: 'malkhut_winter_outlined', location: spriteDir + 'tilesheets/malkhut_winter_outlined.png' },
};

export const PADDING = {
	room: { top: 3, bottom: 0, left: 1, right: 1 }
}

export const ROOMS = {
	room0: 'room0'
}

export const DIRECTION = {
	EAST: 0,
	SOUTH: 1,
	WEST: 2,
	NORTH: 3
};

export const COLORS = {
	RED: 0xFF1010
};

export const PUZZLE_ROOM_SCALE = 4; // puzzle dimensions * SCALE = room dimensions