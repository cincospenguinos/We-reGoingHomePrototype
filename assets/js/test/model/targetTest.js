/**
 * targetTest.js
 */
import { TestHelper } from '../testHelper.js';

QUnit.module('Target', () => {
	QUnit.test('targetBlendByLasers', (assert) => {
		const target = TestHelper.createTarget({
			key: 'target',
			position: { x: 50, y: 10 },
			dimensions: { width: 20, height: 20 },
		})

		target.addStrikingLaser(TestHelper.laserColors.red);
		target.addStrikingLaser(TestHelper.laserColors.green);

		assert.ok(target.isLit(), 'Target should be lit');
		assert.ok(target.isStruckBy(TestHelper.laserColors.red), 'Target should be hit by red laser');
		assert.ok(target.isStruckBy(TestHelper.laserColors.green), 'Target should be hit by blue laser');
		assert.equal(target.color, TestHelper.laserColors.orange, 'Target should be lit orange.');
	});
});