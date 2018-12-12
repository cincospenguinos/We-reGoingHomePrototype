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
}