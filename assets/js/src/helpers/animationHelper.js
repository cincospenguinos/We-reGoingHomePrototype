/**
 * animationHelper.js
 *
 * Helper object to manage animations and attachments to them.
 */
import { ANIMS } from '../../lib/CONST.js';

export class AnimationHelper {
	constructor(scene) {
		this.scene = scene;
	}

	/** Creates the animations in the scene given the puzzle provided. */
	createAnimations(puzzle) {
		puzzle.getTargets().forEach((target) => {
			this.scene.anims.create(ANIMS.puzzle.targetRedTurnedOn);
			this.scene.anims.create(ANIMS.puzzle.targetRedTurnedOff);
			target.addAnimation();
		});
	}
}