/**
 * sceneHelper.js
 *
 * Helper class to make things more readable.
 */
import { DungeonHelper } from './dungeonHelper.js';
import { KEYS } from '../../lib/CONST.js';

export class SceneHelper {

	/** Helper method. Loads an image up into the scene provided. */
	static loadImage(scene, constHash) {
		return scene.load.image(constHash.key, constHash.location);
	}

	/** Helper method. Loads a spritesheet up into the scene provided. */
	static loadSpritesheet(scene, constHash) {
		return scene.load.spritesheet(constHash.key, constHash.location, { 
			frameWidth: constHash.frameWidth, 
			frameHeight: constHash.frameHeight
		});
	}

	/** Helper method. Loads json up into the scene provided. */
	static loadJson(scene, jsonHash) {
		return scene.load.json(jsonHash.key, jsonHash.location);
	}

	/** Helper method. Transitions to the puzzle scene, providing all of the necessary data and shit to do so. */
	static transitionToPuzzleScene(currentScene, dungeon, room, thoughtsController) {
		let puzzle = DungeonHelper.roomToPuzzle(room);

		currentScene.scene.start(KEYS.scene.puzzleScene, {
			dungeon: dungeon,
			puzzle: puzzle,
			playerPosition: puzzle.player.getPosition(),
			thoughtsController: thoughtsController
		});
	}

	/** Helper method. Transitions to the top down scene, setting up all the necessary scaling as we go. */
	static transitionToTopDownScene(currentScene, dungeon, puzzle, thoughtsController) {
		puzzle.solve();
		let room = DungeonHelper.puzzleToRoom(puzzle, dungeon.getRoom(puzzle.roomKey).mapKey);

		currentScene.scene.start(KEYS.scene.topDownScene, {
			dungeon: dungeon,
			room: room,
			thoughtsController: thoughtsController
		});
	}
}