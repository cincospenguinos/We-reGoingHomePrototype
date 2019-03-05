/**
 * soundHelper.js
 *
 * Manages sound effects for the game. Hand it a scene, and it will handle the rest.
 *
 */
import { SOUNDS } from '../../lib/CONST.js';

export class SoundHelper {
	constructor(scene) {
		this.scene = scene;
	}

	loadSounds() {
		this.scene.load.audio(SOUNDS.openPanel.key, [SOUNDS.openPanel.location]);
		this.scene.load.audio(SOUNDS.closePanel.key, [SOUNDS.closePanel.location]);
		this.scene.load.audio(SOUNDS.laserLit.key, [SOUNDS.laserLit.location]);
	}

	playSound(key) {
		this.scene.sound.play(key);
	}
}