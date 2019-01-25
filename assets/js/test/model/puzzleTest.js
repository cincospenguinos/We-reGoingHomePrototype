/**
 * puzzleTest.js
 */
import { TestHelper } from '../testHelper.js';

QUnit.module('Puzzle', () => {
	QUnit.test('solvedPuzzle', (assert) => {
		let puzzle = TestHelper.createPuzzle();
		let laser = TestHelper.createLaser({
			direction: TestHelper.directions.east,
			position: { x: 10, y: 10 },
			dimensions: { width: 0, height: 0 },
		});
		let mirror = TestHelper.createSurface({
			position: { x: 100, y: 15 },
			dimensions: { width: 20, height: 20 },
			direction: TestHelper.directions.west,
		});
		let target = TestHelper.createTarget({
			position: { x: 90, y: 100 },
			dimensions: { width: 20, height: 20 },
		});
		let exit = TestHelper.createExit({
			direction: TestHelper.directions.east,
			position: { x: 100, height: 190},
			dimensions: { width: 10, height: 10 },
		});

		puzzle.addLaser(laser);
		puzzle.addSurface(mirror);
		puzzle.addExit(exit);
		puzzle.addTarget(target);

		// Okay--instead of checking the laser's path, we are going to check if the various conditions are valid
		puzzle.solve();

		assert.ok(puzzle.lasers['laser'].path, 'Laser should have a path assigned to it');
		assert.ok(puzzle.targets['target'].isLit(), 'Target should be lit');
		assert.ok(puzzle.targets['target'].isStruckBy(TestHelper.laserColors.red), 'Target should be struck by red laser');
		assert.ok(puzzle.exits['exit'].isOpen, 'Exit should be open');
	});

	QUnit.test('solvedPuzzleWithBlendedColor', (assert) => {
		let puzzle = TestHelper.createPuzzle();
		let laser = TestHelper.createLaser({
			direction: TestHelper.directions.east,
			position: { x: 10, y: 10 },
			dimensions: { width: 0, height: 0 },
		});
		let otherLaser = TestHelper.createLaser({
			key: 'otherLaser',
			color: TestHelper.laserColors.green,
			direction: TestHelper.directions.west,
			position: { x: 150, y: 10 },
			dimensions: { width: 0, height: 0 },
		});

		puzzle.addLaser(laser);
		puzzle.addLaser(otherLaser);

		puzzle.addTarget(TestHelper.createTarget({
			position: { x: 50, y: 10 },
			dimensions: { width: 20, height: 20 },
		}));

		puzzle.addExit(TestHelper.createExit({
			position: { x: 200, y: 200 },
			dimensions: { width: 0, height: 0 },
			direction: TestHelper.directions.east,
			color: TestHelper.laserColors.orange
		}))

		puzzle.solve();

		let target = puzzle.targets['target'];
		assert.ok(target.isLit(), 'Target should be lit');
		assert.ok(target.isStruckBy(TestHelper.laserColors.red), 'Target should be hit by red laser');
		assert.ok(target.isStruckBy(TestHelper.laserColors.green), 'Target should be hit by blue laser');
		assert.equal(target.color, TestHelper.laserColors.orange, 'Target should be lit orange.');
		assert.ok(puzzle.exits['exit'].isOpen, 'Exit should be open.');
	});

	QUnit.test('notSolvedButThenSolved', (assert) => {
		let puzzle = TestHelper.createPuzzle();
		let mirror = TestHelper.createSurface({
			direction: TestHelper.directions.west,
			position: { x: 100, y: 50 },
			dimensions: { width: 20, height: 20 },
		});

		puzzle.addLaser(TestHelper.createLaser({
			key: 'laserKey',
			direction: TestHelper.directions.east,
			position: { x: 10, y: 10 },
			dimensions: { width: 0, height: 0 },
		}));

		puzzle.addSurface(mirror);

		puzzle.addExit(TestHelper.createExit({
			key: 'exitKey',
			color: TestHelper.laserColors.red,
			position: { x: 100, height: 190},
			dimensions: { width: 10, height: 10 },
			direction: TestHelper.directions.east
		}));

		puzzle.addTarget(TestHelper.createTarget({
			key: 'targetKey',
			position: { x: 90, y: 100 },
			dimensions: { width: 20, height: 20 },
		}));

		puzzle.solve();

		assert.notOk(puzzle.targets['targetKey'].isLit(), 'Target should not be lit');
		assert.notOk(puzzle.targets['targetKey'].isStruckBy(TestHelper.laserColors.red), 'Target should not be struck by laserKey');
		assert.notOk(puzzle.exits['exitKey'].isOpen, 'Exit should not be open');

		mirror.position.y = 10;

		puzzle.solve();

		assert.ok(puzzle.lasers['laserKey'].path, 'Laser should have a path assigned to it');
		assert.ok(puzzle.targets['targetKey'].isLit(), 'Target should be lit');
		assert.ok(puzzle.targets['targetKey'].isStruckBy(TestHelper.laserColors.red), 'Target should be struck by laserKey');
		assert.ok(puzzle.exits['exitKey'].isOpen, 'Exit should be open');
	});

	QUnit.test('weirdLaserBug', (assert) => {
		let puzzle = TestHelper.createPuzzle();

		puzzle.addLaser(TestHelper.createLaser({
			direction: TestHelper.directions.north,
			position: { x: 10, y: 10 },
			dimensions: { width: 0, height: 0 },
		}));

		puzzle.addExit(TestHelper.createExit({
			key: 'exitKey',
			color: TestHelper.laserColors.red,
			position: { x: 100, height: 190},
			dimensions: { width: 10, height: 10 },
			direction: TestHelper.directions.east
		}));

		puzzle.addTarget(TestHelper.createTarget({
			key: 'targetKey',
			position: { x: 10, y: 100 },
			dimensions: { width: 20, height: 20 },
		}));

		puzzle.solve();

		assert.notOk(puzzle.targets['targetKey'].isLit(), 'Target should not be lit');
	});

	QUnit.test('laserCannotHitPlayer', (assert) => {
		let puzzle = TestHelper.createPuzzle();

		puzzle.addLaser(TestHelper.createLaser({
			direction: TestHelper.directions.south,
			position: { x: 10, y: 10 },
			dimensions: { width: 0, height: 0 },
		}));

		puzzle.player = TestHelper.createPlayer({
			position: { x: 6, y: 20 },
			dimensions: { width: 10, height: 10 },
		});

		puzzle.solve();

		assert.notOk(puzzle.valid);

		puzzle.player.position.x += 25;
		puzzle.solve();

		assert.ok(puzzle.valid);
	});
});