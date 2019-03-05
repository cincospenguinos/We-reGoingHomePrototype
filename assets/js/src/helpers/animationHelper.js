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

	/** Handles all of the puzzle animations given the current puzzle and the state difference. Returns
		a couple pieces of information to be picked up and used elsewhere. */
	handlePuzzleAnimations(puzzle, puzzleStateDiff) {
		let result = { targetTurnedOn: false, targetTurnedOff: false };

		puzzle.getTargets().forEach((target) => {
			const prevTarget = puzzleStateDiff.targets.previous[target.key];
			const currentTarget = puzzleStateDiff.targets.current[target.key];

			if (prevTarget && currentTarget) {
				const targetTurnedOn = (prevTarget.length === 0 && currentTarget.length > 0);
				const targetTurnedOff = (prevTarget.length > 0 && currentTarget.length === 0);

				result.targetTurnedOn = result.targetTurnedOn || targetTurnedOn;
				result.targetTurnedOff = result.targetTurnedOff || targetTurnedOff;

				if (targetTurnedOn) {
					target.turnedOn(this.scene);
					puzzle.getExits()
						.filter(e => e.color.key === currentTarget[0])
						.forEach((exit) => {
							exit.triggerAnimation();
						});
				} else if (targetTurnedOff) {
					target.turnedOff(this.scene);
					puzzle.getExits()
						.forEach((exit) => {
							exit.triggerAnimation();
						});
				} else if (prevTarget.length === currentTarget.length) {
					prevTarget.forEach((color) => {
						if (currentTarget.indexOf(color) === -1) {
							// TODO: Get the proper colored animation up and running here
							console.log('target changed color');
						}
					});
				}
			}
		});

		return result;
	}
}