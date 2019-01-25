/**
 * targetTest.js
 */
QUnit.module('Target', () => {
	QUnit.test('targetBlendByLasers', (assert) => {
		let puzzle = new Puzzle({
			dimensions: { width: 200, height: 200 },
			key: 'somepuzzle',
			roomKey: 'someroom',
			mapName: 'name'
		});

		puzzle.addLaser(new Laser({
			key: 'laser',
			color: LaserColor.RED,
			direction: Direction.EAST,
			position: { x: 10, y: 10 },
			dimensions: { width: 0, height: 0 },
			laserInteractable: true
		}));

		puzzle.addLaser(new Laser({
			key: 'otherLaser',
			color: LaserColor.GREEN,
			direction: Direction.WEST,
			position: { x: 150, y: 10 },
			dimensions: { width: 0, height: 0 },
			laserInteractable: true
		}));

		puzzle.addTarget(new Target({
			key: 'target',
			position: { x: 50, y: 10 },
			dimensions: { width: 20, height: 20 },
			laserInteractable: true
		}));

		puzzle.solve();

		let target = puzzle.targets['target'];
		assert.ok(target.isLit(), 'Target should be lit');
		assert.ok(target.isStruckBy(LaserColor.RED), 'Target should be hit by red laser');
		assert.ok(target.isStruckBy(LaserColor.GREEN), 'Target should be hit by blue laser');
		assert.equal(target.color, LaserColor.ORANGE, 'Target should be lit orange.');
	});
});