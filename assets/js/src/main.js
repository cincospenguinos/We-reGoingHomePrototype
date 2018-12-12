/**
 * main.js
 */
import { PuzzleScene } from './scenes/puzzleScene.js';

var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: [ PuzzleScene ],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {},
			debug: true
		}
	}
};

var game = new Phaser.Game(config);