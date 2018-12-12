/**
 * main.js
 *
 */
var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	scene: [ ScenePuzzle ],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {},
			debug: true
		}
	}
};

var game = new Phaser.Game(config);