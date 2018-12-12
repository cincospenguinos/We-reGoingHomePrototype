/**
 * main.js
 */
import { MenuScene } from './scenes/menuScene.js';
import { PuzzleScene } from './scenes/puzzleScene.js';
import { TransverseScene } from './scenes/transverseScene.js';

var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: [ MenuScene, PuzzleScene, TransverseScene ],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {},
			debug: true
		}
	}
};

var game = new Phaser.Game(config);