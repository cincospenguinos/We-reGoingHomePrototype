/**
 * dungeonHelperTest.js
 */

QUnit.module('DungeonHelper', () => {
	QUnit.test('converterMethods', (assert) => {
		let puzzle = new Puzzle({
			dimensions: { width: 200, height: 200 },
			key: 'somepuzzle',
			roomKey: 'someroom',
			mapName: 'name'
		});

		let laser = new Laser({
			key: 'laser',
			color: LaserColor.RED,
			direction: Direction.EAST,
			position: { x: 10, y: 10 },
			dimensions: { width: 0, height: 0 },
			laserInteractable: true
		});
		puzzle.addLaser(laser);

		let surface = new Surface({
			type: Surface.REFLECTIVE,
			direction: Direction.WEST,
			position: { x: 100, y: 10 },
			dimensions: { width: 20, height: 20 },
			laserInteractable: true
		});
		puzzle.addSurface(surface);

		let target = new Target({
			key: 'target',
			position: { x: 90, y: 100 },
			dimensions: { width: 20, height: 20 },
			laserInteractable: true
		});
		puzzle.addTarget(target);

		let player = new Player({
			position: { x: 50, y: 50 },
			dimensions: { width: 0, height: 0 }
		});
		puzzle.setPlayer(player);

		let room = DungeonHelper.puzzleToRoom(puzzle);

		assert.ok(room.puzzleItems.length === 3, 'Room has correct puzzle items.');
		room.puzzleItems.forEach((item) => {
			if (item instanceof Laser) {
				assert.deepEqual({ x: laser.position.x * PUZZLE_ROOM_SCALE, y: laser.position.y * PUZZLE_ROOM_SCALE }, 
					item.position, 'Laser is in correct position.');
			} else if (item instanceof Target) {
				assert.deepEqual({ x: target.position.x * PUZZLE_ROOM_SCALE, y: target.position.y * PUZZLE_ROOM_SCALE }, 
					item.position, 'Target is in correct position.');
			} else if (item instanceof Surface) {
				assert.deepEqual({ x: surface.position.x * PUZZLE_ROOM_SCALE, y: surface.position.y * PUZZLE_ROOM_SCALE }, 
					item.position, 'Mirror is in correct position.');
			}
		});
		assert.deepEqual(room.player.position, { x: 200, y: 200 }, 'Room should have a player');

		let newPuzzle = DungeonHelper.roomToPuzzle(room);
		newPuzzle.getLasers().forEach((laser) => {
			assert.ok(puzzle.lasers[laser.key], 'New puzzle has laser.');
			assert.deepEqual(puzzle.lasers[laser.key].position, laser.position, 'Positions are correct');
			assert.deepEqual(puzzle.lasers[laser.key].dimensions, laser.dimensions, 'Dimensions are correct.');
		});
	});
});