/**
 * targetTest.js
 */
import { TestHelper } from '../testHelper.js';

QUnit.module('Target', () => {
	QUnit.test('targetBlendByLasers', (assert) => {
		let puzzle = TestHelper.createPuzzle();

		puzzle.addLaser(TestHelper.createLaser({
			key: 'laser',
			color: TestHelper.laserColors.red,
			direction: TestHelper.directions.east,
			position: { x: 10, y: 10 },
			dimensions: { width: 0, height: 0 },
		}));

		puzzle.addLaser(TestHelper.createLaser({
			key: 'otherLaser',
			color: TestHelper.laserColors.green,
			direction: TestHelper.directions.west,
			position: { x: 150, y: 10 },
			dimensions: { width: 0, height: 0 },
		}));

		puzzle.addTarget(TestHelper.createTarget({
			key: 'target',
			position: { x: 50, y: 10 },
			dimensions: { width: 20, height: 20 },
		}));

		puzzle.solve();

		let target = puzzle.targets['target'];
		assert.ok(target.isLit(), 'Target should be lit');
		assert.ok(target.isStruckBy(TestHelper.laserColors.red), 'Target should be hit by red laser');
		assert.ok(target.isStruckBy(TestHelper.laserColors.green), 'Target should be hit by blue laser');
		assert.equal(target.color, TestHelper.laserColors.orange, 'Target should be lit orange.');
	});
});