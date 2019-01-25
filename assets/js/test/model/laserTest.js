/**
 * laserTest.js
 */
import { TestHelper } from '../testHelper.js'

QUnit.module('Laser', () => {
	QUnit.test('sameColoredLasersMayCross', (assert) => {
		// let puzzle = TestHelper.createPuzzle();

		let l1 = new Laser({
			key: 'l1',
			position: { x: 10, y: 10 },
			direction: Direction.EAST,
			color: LaserColor.RED,
			dimensions: { width: 0, height: 0 },
		});
		puzzle.addLaser(l1);

		let l2 = new Laser({
			key: 'l2',
			position: { x: 75, y: 5 },
			direction: Direction.SOUTH,
			color: LaserColor.RED,
			dimensions: { width: 0, height: 0 },
		});
		puzzle.addLaser(l2);

		puzzle.solve();
		assert.notEqual(l1.path[1], l2.path[2], 'Same colored lasers should be allowed to cross');
	});

	QUnit.test('differentColoredLasersMayNotCross', (assert) => {
		let puzzle = new Puzzle({
			dimensions: { width: 100, height: 100 },
			key: 'somepuzzle',
			roomKey: 'someroom',
			mapName: 'name'
		});

		let l1 = new Laser({
			key: 'l1',
			position: { x: 10, y: 10 },
			direction: Direction.EAST,
			color: LaserColor.RED,
			dimensions: { width: 0, height: 0 },
		});
		puzzle.addLaser(l1);

		let l2 = new Laser({
			key: 'l2',
			position: { x: 75, y: 5 },
			direction: Direction.SOUTH,
			color: LaserColor.GREEN,
			dimensions: { width: 0, height: 0 },
		});
		puzzle.addLaser(l2);

		puzzle.solve();
		assert.equal(l1.path[1], l2.path[1], 'Different colored lasers may not cross');
	});
})