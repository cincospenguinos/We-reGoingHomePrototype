/**
 * main.js
 */
import { MenuScene } from './scenes/menuScene.js';
import { PuzzleScene } from './scenes/puzzleScene.js';
import { TraverseScene } from './scenes/traverseScene.js';
import { TopDownScene } from './scenes/topDownScene.js';

var config = {
	type: Phaser.Auto,
	width: 1200,
	height: 900,
	scene: [ MenuScene, PuzzleScene, TraverseScene, TopDownScene ],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {},
			debug: true
		}
	}
};

var game = new Phaser.Game(config);