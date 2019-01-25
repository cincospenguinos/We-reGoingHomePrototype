/**
 * laserColorTest.js
 */
import { LaserColor } from '../../src/model/laserColor.js';

QUnit.module('LaserColor', () => {
	QUnit.test('laserColorBlends', (assert) => {
		assert.equal(LaserColor.blend([LaserColor.RED, LaserColor.GREEN]), LaserColor.ORANGE, 'RED + GREEN = ORANGE');
		assert.equal(LaserColor.blend([LaserColor.RED, LaserColor.BLUE]), LaserColor.PURPLE, 'RED + BLUE = PURPLE');
		assert.equal(LaserColor.blend([LaserColor.GREEN, LaserColor.BLUE]), LaserColor.YELLOW, 'GREEN + BLUE = YELLOW');
		assert.equal(LaserColor.blend([LaserColor.RED, LaserColor.RED]), LaserColor.RED, 'Blending the same color returns the same color');
		assert.equal(LaserColor.blend([LaserColor.RED, LaserColor.GREEN, LaserColor.BLUE]), LaserColor.WHITE, 'Blending all the colors yields white');
		assert.equal(LaserColor.blend([LaserColor.RED, LaserColor.GREEN, LaserColor.RED]), LaserColor.ORANGE, 'Multiples of a color make no difference.')
	});
})