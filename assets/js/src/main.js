/**
 * main.js
 */
import { MenuScene } from './scenes/menuScene.js';
import { PuzzleScene } from './scenes/puzzleScene.js';
import { TraverseScene } from './scenes/traverseScene.js';

var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: [ MenuScene, PuzzleScene, TraverseScene ],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {},
			debug: true
		}
	}
};

var game = new Phaser.Game(config);