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
			// TODO: Modify this so that it respects color
			this.scene.anims.create(ANIMS.puzzle.targetRedTurnedOn);
			target.addAnimation('turnedOnRed', ANIMS.puzzle.targetRedTurnedOn.key);
			this.scene.anims.create(ANIMS.puzzle.targetRedTurnedOff);
			target.addAnimation('turnedOffRed', ANIMS.puzzle.targetRedTurnedOff.key);
		});

		puzzle.getExits().forEach((exit) => {
			// TODO: Modify this so it respects color
			this.scene.anims.create(ANIMS.puzzle.exitRedTurnedOn);
			exit.addAnimation('turnedOn', ANIMS.puzzle.exitRedTurnedOn.key);
			this.scene.anims.create(ANIMS.puzzle.exitRedTurnedOff);
			exit.addAnimation('turnedOff', ANIMS.puzzle.exitRedTurnedOff.key);
		});
	}
}