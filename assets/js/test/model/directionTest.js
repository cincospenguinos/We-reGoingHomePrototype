/**
 * directionTest.js
 */
import { Direction } from '../../src/model/direction.js';

QUnit.module('Direction', () => {
	QUnit.test('rotatedDirectionTest', (assert) => {
		assert.equal(Direction.directionFromRotation(Direction.EAST, 90), Direction.SOUTH);
		assert.equal(Direction.directionFromRotation(Direction.SOUTH, 90), Direction.WEST);
		assert.equal(Direction.directionFromRotation(Direction.WEST, 90), Direction.NORTH);
		assert.equal(Direction.directionFromRotation(Direction.NORTH, 90), Direction.EAST);

		assert.equal(Direction.directionFromRotation(Direction.EAST, -90), Direction.NORTH);
		assert.equal(Direction.directionFromRotation(Direction.SOUTH, -90), Direction.EAST);
		assert.equal(Direction.directionFromRotation(Direction.WEST, -90), Direction.SOUTH);
		assert.equal(Direction.directionFromRotation(Direction.NORTH, -90), Direction.WEST);
	});
});