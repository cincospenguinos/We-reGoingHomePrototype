/**
 * main.js
 */
import { MenuScene } from './scenes/menuScene.js';
import { PuzzleScene } from './scenes/puzzleScene.js';
import { TopDownScene } from './scenes/topDownScene.js';
import { LevelEditorScene } from './scenes/levelEditorScene.js';

var config = {
	type: Phaser.Auto,
	width: 800,
	height: 600,
	scene: [ MenuScene, PuzzleScene, TopDownScene, LevelEditorScene ],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {},
			// debug: true,
		}
	}
};

var game = new Phaser.Game(config);