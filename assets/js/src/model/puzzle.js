/**
 * puzzle.js
 *
 * Represents a puzzle.
 *
 */
import { Surface } from './surface.js';
import { Laser } from './laser.js';
import { PuzzleItem } from './puzzleItem.js';
import { Exit } from './exit.js';
import { Direction } from './direction.js';
import { Target } from './target.js';
import { Player } from './player.js';

export class Puzzle {

	constructor(opts) {
		this.dimensions = opts.dimensions;
		this.key = opts.key;
		this.roomKey = opts.roomKey;
		this.mapName = opts.mapName;
		this.thoughts = opts.thoughts || [];

		this.targets = {};
		this.surfaces = [];
		this.panels = [];
		this.exits = {};
		this.lasers = {};
		this.valid = true;

		if (!this.key || !this.roomKey || !this.mapName) {
			throw 'Every Puzzle requires a key, a room key, and a map name!'
		}
	}

	setValid(bool) {
		this.valid = bool;
	}

	/** Helper method. Resets the various state variables so that they can be properly set by solve() */
	reset() {
		this.getExits().forEach((exit) => { exit.reset(); });
		this.getTargets().forEach((target) => { target.resetStrikingLasers(); });
		this.valid = null;
	}

	/** Helper method. To ensure that no weird bugs with position occur switching between scenes, 
		this will reset images of the various pieces. */
	resetImgs() {
		this.getExits().forEach((i) => { i.img = null; });
		this.getLasers().forEach((i) => { i.resetImg(); });
		this.getTargets().forEach((i) => { i.resetImg(); });
		this.getLaserInteractable().forEach((i) => { i.resetImg(); });
	}

	/** Add surface to the puzzle. */
	addSurface(surface) {
		surface instanceof Surface ? this.surfaces.push(surface) : (() => { throw 'surface must be an instance of Surface!'});
	}

	/** Adds the exit provided to the puzzle. */
	addExit(exit) {
		exit instanceof Exit ? this.exits[exit.key] = exit : (() => { throw 'exit must ben an instance of Exit!'});
	}

	/** Adds the laser provided. */
	addLaser(laser) {
		laser instanceof Laser ? this.lasers[laser.key] = laser : (() => { throw 'laser must be an instance of Laser!' });
	}

	/** Adds the target provided. */
	addTarget(target) {
		target instanceof Target ? this.targets[target.key] = target : (() => { throw 'target must be an instance of Target!' });
	}

	/** Adds the panel provided to the puzzle. */
	addPanel(panel) {
		panel instanceof PuzzleItem ? this.panels.push(panel) : (() => { throw 'panel must be an instance of Panel!'});
	}

	/** Adds a striking laser to the target. */
	addStrikingLaser(laserKey, targetKey) {
		if (!this.lasers[laserKey] || !this.targets[targetKey]) {
			throw `Cannot find target or laser! ${laserKey} || ${targetKey}`;
		}

		this.targets[targetKey].addStrikingLaser(this.lasers[laserKey].color);
		this.getTargets().forEach((target) => {
			this.getExits().forEach((exit) => {
				exit.colorStruck(target.color);
			});
		});
	}

	setPlayer(player) {
		if (!(player instanceof Player)) {
			throw 'Player provided is not a Player object!';
		}

		this.player = player;
	}

	setTranslation(translation) {
		this.translation = translation;
	}

	/*--PRIVATE */

	/** Helper method. Returns all PuzzleItems that are interactable with a laser. */
	getLaserInteractable() {
		return this.getLasers().concat(this.surfaces, this.getTargets()).filter((i) => i.laserInteractable);
	}

	/** Helper method. Returns the lasers as an array. */
	getLasers() {
		return Object.keys(this.lasers).map((lKey) => { return this.lasers[lKey] });
	}

	/** Helper method. Returns array of targets. */
	getTargets() {
		return Object.keys(this.targets).map((tKey) => { return this.targets[tKey] });
	}

	/** Helper method. Returns array of exits. */
	getExits() {
		return Object.keys(this.exits).map((eKey) => { return this.exits[eKey] });
	}

	/** Helper method. Returns all items in the puzzle. */
	getAllItems() {
		return this.getLasers().concat(this.surfaces, this.getTargets(), this.getExits(), this.panels);
	}

	/** Helper method. Returns the exits that are connected to the laser provided. */
	exitsConnectedTo(color) {
		return this.getExits().filter((exit) => { return color === exit.color });
	}
}