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
	puzzleTargetRed: { key: 'puzzleTargetRed', location: spriteDir + 'puzzle/target_red.png', frameWidth: 64, frameHeight: 64 },
	puzzleExitRed: { key: 'puzzleExitRed', location: spriteDir + 'puzzle/exit_red.png', frameWidth: 32, frameHeight: 32 },

	// Room-sized sprites
	roomLaser: { key: 'roomLaser', location: spriteDir + 'room/laser.png', frameWidth: 256, frameHeight: 256 },
	roomTarget: { key: 'roomTarget', location: spriteDir + 'room/target.png', frameWidth: 256, frameHeight: 256 },
	roomMirror: { key: 'roomMirror', location: spriteDir + 'room/mirror.png', frameWidth: 128, frameHeight: 128 },
	roomPanel: { key: 'roomPanel', location: spriteDir + 'room/panel.png', frameWidth: 64, frameHeight: 64 },
	roomPlayer: { key: 'roomPlayer', location: spriteDir + 'room/player.png', frameWidth: 64, frameHeight: 64 },

	roomTargetRedLit: { key: 'roomTargetRedLit', location: spriteDir + 'room/target_red_animated.png', frameWidth: 256, frameHeight: 256 },

	mainCharacter: { key: 'mainCharacter', location: spriteDir + 'mainCharacter.png' },

	// Tilesheet shit
	malkhutTilesheet: { key: 'malkhut_winter_tilesheet', location: `${spriteDir}tilesheets/malkhut_winter_tilesheet.png` },
	doorTilesheet: { key: 'door_tilesheet', location: `${spriteDir}tilesheets/door_tilesheet.png`},
};

export const ANIMS = {
	puzzle: {
		targetRedTurnedOn: {
			key: 'targetRedTurnedOn',
			frameRate: 12,
			yoyo: false,
			repeat: 0,
			frames: [
				{ key: SPRITES.puzzleTargetRed.key, frame: 0 },
				{ key: SPRITES.puzzleTargetRed.key, frame: 1 },
				{ key: SPRITES.puzzleTargetRed.key, frame: 2 },
				{ key: SPRITES.puzzleTargetRed.key, frame: 3 },
				{ key: SPRITES.puzzleTargetRed.key, frame: 4 },
				{ key: SPRITES.puzzleTargetRed.key, frame: 5 },
				{ key: SPRITES.puzzleTargetRed.key, frame: 6 },
			],
		},
		targetRedTurnedOff: {
			key: 'targetRedTurnedOff',
			frameRate: 12,
			yoyo: false,
			repeat: 0,
			frames: [
				{ key: SPRITES.puzzleTargetRed.key, frame: 6 },
				{ key: SPRITES.puzzleTargetRed.key, frame: 12 },
				{ key: SPRITES.puzzleTargetRed.key, frame: 13 },
				{ key: SPRITES.puzzleTargetRed.key, frame: 14 },
				{ key: SPRITES.puzzleTargetRed.key, frame: 15 },
				{ key: SPRITES.puzzleTargetRed.key, frame: 16 },
				{ key: SPRITES.puzzleTargetRed.key, frame: 17 },
			]
		},
		exitRedTurnedOn: {
			key: 'exitRedTurnedOn',
			frameRate: 12,
			yoyo: false,
			repeat: 0,
			frames: [
				{ key: SPRITES.puzzleExitRed.key, frame: 0 },
				{ key: SPRITES.puzzleExitRed.key, frame: 7 },
				{ key: SPRITES.puzzleExitRed.key, frame: 8 },
				{ key: SPRITES.puzzleExitRed.key, frame: 9 },
				{ key: SPRITES.puzzleExitRed.key, frame: 10 },
				{ key: SPRITES.puzzleExitRed.key, frame: 11 },
				{ key: SPRITES.puzzleExitRed.key, frame: 12 },
				{ key: SPRITES.puzzleExitRed.key, frame: 13 },
				{ key: SPRITES.puzzleExitRed.key, frame: 14 },
			]
		},
		exitRedTurnedOff: {
			key: 'exitRedTurnedOff',
			frameRate: 12,
			yoyo: false,
			repeat: 0,
			frames: [
				{ key: SPRITES.puzzleExitRed.key, frame: 14 },
				{ key: SPRITES.puzzleExitRed.key, frame: 21 },
				{ key: SPRITES.puzzleExitRed.key, frame: 22 },
				{ key: SPRITES.puzzleExitRed.key, frame: 23 },
				{ key: SPRITES.puzzleExitRed.key, frame: 24 },
				{ key: SPRITES.puzzleExitRed.key, frame: 25 },
				{ key: SPRITES.puzzleExitRed.key, frame: 26 },
				{ key: SPRITES.puzzleExitRed.key, frame: 27 },
				{ key: SPRITES.puzzleExitRed.key, frame: 0 },
			]
		},
	},
	room: {
		targetRedLit: {
			key: 'roomTargetRedLit',
			frameRate: 10,
			yoyo: false,
			repeat: -1,
		},
	},
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

export const PUZZLE_ROOM_SCALE = 4;