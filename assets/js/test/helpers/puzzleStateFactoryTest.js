/**
 * puzzleStateFactoryTest.js
 */
import { TestHelper } from '../testHelper.js';

import { PuzzleStateFactory } from '../../src/helpers/puzzleStateFactory.js';

QUnit.module('PuzzleStateFactory', (assert) => {
	QUnit.module('diff', (assert) => {
		QUnit.test('shows no change in striking lasers', (assert) => {
			const laser = TestHelper.createLaser({ direction: TestHelper.directions.east });

			const previous = {
				targets: {
					target1: [laser]
				}, 
				valid: true,
			};

			const current = {
				targets: {
					target1: [laser]
				}, 
				valid: true,
			};

			const diff = PuzzleStateFactory.diff(previous, current);
			assert.equal(diff.targets.previous['target1'].length, diff.targets.current['target1'].length, 'No change in targets should be shown.');
		});

		QUnit.test('shows change in striking lasers', (assert) => {
			const laser = TestHelper.createLaser({ direction: TestHelper.directions.east });

			const previous = {
				targets: {
					target1: [laser]
				}, 
				valid: true,
			};

			const current = {
				targets: {
					target1: []
				}, 
				valid: true,
			};

			const diff = PuzzleStateFactory.diff(previous, current);
			assert.notEqual(diff.targets.previous['target1'].length, diff.targets.current['target1'].length, 'No change in targets should be shown.');
		});

		QUnit.test('ensures all targets across both are included in diff', (assert) => {
			const laser = TestHelper.createLaser({ direction: TestHelper.directions.east });

			const previous = {
				targets: {
					target1: [laser]
				}, 
				valid: true,
			};

			const current = {
				targets: {},
				valid: true,
			};

			const diff = PuzzleStateFactory.diff(previous, current);
			assert.ok(diff.targets.current['target1'], 'target1 should be included');
			assert.notEqual(diff.targets.previous['target1'].length, diff.targets.current['target1'].length, 'No change in targets should be shown.');
		});
	});
});