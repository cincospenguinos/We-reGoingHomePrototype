/**
 * thoughtsController.js
 *
 * Representation of the King's thoughts. This is to be used as a means of communicating to the player
 * aspects of the world, and story, as well as interactability and tutorial devices. Uses the data file
 * thoughts.json to manage things.
 *
 * While I'm at it, here's something about the keys of the thought set:
 * - If the thought intends to convey something about play to the player, it starts with "tutorial"
 */
export class ThoughtsController {

	constructor(thoughtSet) {
		this.thoughts = thoughtSet;

		this.currentlyDisplayed = {};
		this.fontCfg = { fontSize: '32px', fill: '#EFEFEF', backgroundColor: '#101010' };
	}

	/** Setter for the scene that this thoughts controller is maintained in. */
	setScene(scene) {
		this.dismissAll;
		this.scene = scene;
	}

	/** Shows a thought matching the key provided at the position provided.*/
	showThought(key, position, opts = {}) {
		let thought = this.thoughts[key];

		if (!thought) {
			throw 'Thought "' + key + '" not found!';
		}

		if (!this.scene) {
			throw 'No scene to show the thought in!'
		}

		let thoughtImg = this.scene.add.text(position.x, position.y, thought, this.fontCfg).setAlpha(0.8);
		this.scene.tweens.add({
			targets: thoughtImg,
			x: position.x,
			y: position.y,
			ease: 'Power2',
			duration: 5000,
			delay: 1000
		})
		this.currentlyDisplayed[key] = thoughtImg;

		// TODO: Timer or something that causes it to disappear after some amount of time
		// TODO: Setup overlay option vs. "in world" option
	}

	/** Dismisses the thought matching the key provided. */
	dismissThought(key) {
		if (this.currentlyDisplayed[key]) {
			this.currentlyDisplayed[key].destroy();
		}
	}

	/** Dismisses all thoughts that are currently displayed. */
	dismissAll() {
		Object.keys(this.currentlyDisplayed).forEach((key) => {
			this.dismissThought(key);
		});
	}
}

ThoughtsController.INFTY = -1; // For thoughts that are to disappear after dismissing