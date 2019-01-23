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
import { Thought } from '../model/thought.js';

export class ThoughtsController {

	constructor(thoughtSet) {
		this.thoughts = thoughtSet;

		this.currentlyDisplayed = {};
	}

	/** Setter for the scene that this thoughts controller is maintained in. */
	setScene(scene, thoughts=null) {
		this.dismissAll();
		this.scene = scene;

		if (thoughts) {
			thoughts.forEach((thought) => {
				showThought(thought.key, thought.position);	
			});
		}
	}

	/** Shows a thought matching the key provided at the position provided.*/
	showThought(thought) {
		let text = this.thoughts[thought.key];

		if (!text) {
			throw 'Thought "' + key + '" not found!';
		}

		if (!this.scene) {
			throw 'No scene to show the thought in!'
		}

		thought.img = this.scene.add.text(thought.position.x, thought.position.y, text, thought.fontCfg).setAlpha(0.1);
		this.setupInteractivity(thought.key, thought.img);
		this.currentlyDisplayed[thought.key] = thought;

		// TODO: Timer or something that causes it to disappear after some amount of time
		// TODO: Setup overlay option vs. "in world" option
	}

	/** Dismisses the thought matching the key provided. */
	dismissThought(key) {
		let thought = this.currentlyDisplayed[key];

		if (thought) {
			thought.img.destroy();
			thought.dismissed = true;
		}
	}

	/** Dismisses all thoughts that are currently displayed. */
	dismissAll() {
		Object.keys(this.currentlyDisplayed).forEach((key) => {
			this.dismissThought(key);
		});
	}

	setupInteractivity(key, img) {
		// TODO: Use tweens to make the mouse over events fade in and out
		img.setInteractive().on('pointerover', (evt) => {
			img.setAlpha(0.8);
		});

		img.on('pointerout', (evt) => {
			img.setAlpha(0.1);
		});

		img.on('pointerdown', (evt) => {
			this.dismissThought(key);
		});
	}
}

ThoughtsController.INFTY = -1; // For thoughts that are to disappear after dismissing