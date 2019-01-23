/**
 * sceneHelper.js
 *
 * Helper class to make things more readable.
 */
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
}