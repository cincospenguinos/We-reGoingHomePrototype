/**
 * sceneHelper.js
 *
 * Helper class to make things more readable.
 */
import { DungeonHelper } from './dungeonHelper.js';
import { PuzzleSolver } from './puzzleSolver.js';

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
	static transitionToPuzzleScene(currentScene, data) {
		this.assertTransitionDataCorrect(data, { room: true });
		data.puzzle = DungeonHelper.roomToPuzzle(data.room);
		currentScene.scene.start(KEYS.scene.puzzleScene, data);
	}

	/** Helper method. Transitions to the top down scene, setting up all the necessary scaling as we go. */
	static transitionToTopDownScene(currentScene, data) {
		this.assertTransitionDataCorrect(data, { puzzle: true });

		new PuzzleSolver(data.puzzle).solve();
		debugger;
		data.room = DungeonHelper.puzzleToRoom(data.puzzle, data.dungeon.getRoom(data.puzzle.roomKey).mapKey);
		currentScene.scene.start(KEYS.scene.topDownScene, data);
	}

	/** Helper method. Ensures the data needed to transition from one scene to the other is all there, with the sception of the stuff specific to individual transitions. */
	static assertTransitionDataCorrect(data, opts) {
		if (!data.dungeon) {
			throw 'Dungeon is necessary for this scene transition!';
		}

		if (!data.thoughtsController) {
			throw 'Thoughts controller is necessary to pass around!';
		}

		if (opts.puzzle && !data.puzzle) {
			throw 'Puzzle is necessary for this transition!';
		}

		if (opts.room && !data.room) {
			throw 'Room is necessary for this transition!';
		}
	}
}