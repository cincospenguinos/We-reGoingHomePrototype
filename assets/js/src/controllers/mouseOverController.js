/**
 * mouseOverController.js
 *
 * Handles mouse over for the game. Keeps track of objects that have mouse-over properties
 * and ensures that mouse-over events occur for each of them.
 */
export class MouseOverController {
	constructor(scene) {
		this.scene = scene;
		this.objs = {};
		this.overObj = null;

		this.scene.input.setDefaultCursor('url(assets/sprites/pointer/pointerDefault.png), pointer');
	}

	mouseOver(objKey) {
		this.overObj = this.objs[objKey];

		if (this.overObj.movable && this.overObj.rotatable) {
			this.scene.input.setDefaultCursor('url(assets/sprites/pointer/pointerMoveRotate.png), pointer');
		} else if (this.overObj.movable) {
			this.scene.input.setDefaultCursor('url(assets/sprites/pointer/pointerMove.png), pointer');
		} else if (this.overObj.rotatable) {
			this.scene.input.setDefaultCursor('url(assets/sprites/pointer/pointerRotate.png), pointer');
		} else {
			this.scene.input.setDefaultCursor('url(assets/sprites/pointer/pointerInteract.png), pointer');
		}

		this.overObj.mouseOver(); 
	}

	mouseOut() {
		this.scene.input.setDefaultCursor('url(assets/sprites/pointer/pointerDefault.png), pointer');
		this.overObj.mouseOut();
		this.overObj = null;
	}

	addMouseOver(obj) {
		this.objs[obj.key] = obj;
	}
}