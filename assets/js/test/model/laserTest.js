/**
 * laserTest.js
 */
import { TestHelper } from '../testHelper.js'

QUnit.module('Laser', () => {
	QUnit.test('sameColoredLasersMayCross', (assert) => {
		let puzzle = TestHelper.createPuzzle();

		let l1 = TestHelper.createLaser({
			key: 'l1',
			position: { x: 10, y: 10 },
			direction: TestHelper.directions.east,
			color: TestHelper.laserColors.red,
			dimensions: { width: 0, height: 0 },
		});
		puzzle.addLaser(l1);

		let l2 = TestHelper.createLaser({
			key: 'l2',
			position: { x: 75, y: 5 },
			direction: TestHelper.directions.south,
			color: TestHelper.laserColors.red,
			dimensions: { width: 0, height: 0 },
		});
		puzzle.addLaser(l2);

		puzzle.solve();
		assert.notEqual(l1.path[1], l2.path[2], 'Same colored lasers should be allowed to cross');
	});

	QUnit.test('differentColoredLasersMayNotCross', (assert) => {
		let puzzle = TestHelper.createPuzzle();

		let l1 = TestHelper.createLaser({
			key: 'l1',
			position: { x: 10, y: 10 },
			direction: TestHelper.directions.east,
			color: TestHelper.laserColors.red,
			dimensions: { width: 0, height: 0 },
		});
		puzzle.addLaser(l1);

		let l2 = TestHelper.createLaser({
			key: 'l2',
			position: { x: 75, y: 5 },
			direction: TestHelper.directions.south,
			color: TestHelper.laserColors.green,
			dimensions: { width: 0, height: 0 },
		});
		puzzle.addLaser(l2);

		puzzle.solve();
		assert.equal(l1.path[1], l2.path[1], 'Different colored lasers may not cross');
	});
})