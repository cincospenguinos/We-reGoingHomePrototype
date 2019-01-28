/**
 * puzzleSolverTest.js
 */
import { TestHelper } from '../testHelper.js';
import { PuzzleSolver } from '../../src/helpers/puzzleSolver.js';

QUnit.module('PuzzleSolver', () => {

	QUnit.module('single laser puzzle', (assert) => {
		QUnit.test('solves a puzzle with a single laser', (assert) => {
			let puzzle = TestHelper.createPuzzle();
			puzzle.setTranslation({ x: 0, y: 0 });

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

			const puzzleSolver = new PuzzleSolver(puzzle);
			puzzleSolver.solve();

			assert.ok(puzzle.lasers['laser'].path, 'Laser should have a path assigned to it');
			assert.ok(puzzle.targets['target'].isLit(), 'Target should be lit');
			assert.ok(puzzle.targets['target'].isStruckBy(TestHelper.laserColors.red), 'Target should be struck by red laser');
			assert.ok(puzzle.exits['exit'].isOpen, 'Exit should be open');
		});

		QUnit.test('not solved but then solved', (assert) => {
			let puzzle = TestHelper.createPuzzle();
			puzzle.setTranslation({ x: 0, y: 0 });

			let laser = TestHelper.createLaser({
				direction: TestHelper.directions.east,
				position: { x: 10, y: 10 },
				dimensions: { width: 0, height: 0 },
			});
			let mirror = TestHelper.createSurface({
				position: { x: 10, y: 60 },
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

			const puzzleSolver = new PuzzleSolver(puzzle);
			puzzleSolver.solve();

			assert.ok(puzzle.lasers['laser'].path, 'Laser should have a path assigned to it');
			assert.notOk(puzzle.targets['target'].isLit(), 'Target should not be lit');
			assert.notOk(puzzle.targets['target'].isStruckBy(TestHelper.laserColors.red), 'Target should not be struck by red laser');
			assert.notOk(puzzle.exits['exit'].isOpen, 'Exit should not be open');

			mirror.position = { x: 100, y: 10 };

			puzzleSolver.solve();

			assert.ok(puzzle.lasers['laser'].path, 'Laser should have a path assigned to it');
			assert.ok(puzzle.targets['target'].isLit(), 'Target should be lit');
			assert.ok(puzzle.targets['target'].isStruckBy(TestHelper.laserColors.red), 'Target should not be struck by red laser');
			assert.ok(puzzle.exits['exit'].isOpen, 'Exit should not be open');

			const diffState = { 
				targets: {
					previous: {},
					current: {
						target: [TestHelper.laserColors.red.key],
					},
				},

				valid: { previous: true, current: true }
			};

			assert.deepEqual(puzzleSolver.puzzleStateDiff(), diffState, 'Diff should notify change in targets and exits');
		});

		// TODO: solved and then not solved

		// TODO: Check validity when laser hits player
	});

	QUnit.module('multi-laser puzzle', (assert) => {
		QUnit.test('puzzle unsolved when lasers crossed', (assert) => {
			let puzzle = TestHelper.createPuzzle();
			puzzle.setTranslation({ x: 0, y: 0 });

			let laser1 = TestHelper.createLaser({
				direction: TestHelper.directions.east,
				position: { x: 50, y: 50 },
				dimensions: { width: 0, height: 0 },
			});

			let laser2 = TestHelper.createLaser({
				key: 'otherlaser',
				position: { x: 80, y: 10 },
				dimensions: { width: 0, height: 0 },
				color: TestHelper.laserColors.green,
				direction: TestHelper.directions.south,
			})

			let target = TestHelper.createTarget({
				position: { x: 100, y: 55 },
				dimensions: { width: 20, height: 20 },
			});

			let exit = TestHelper.createExit({
				direction: TestHelper.directions.east,
				position: { x: 100, height: 190},
				dimensions: { width: 10, height: 10 },
			});

			puzzle.addLaser(laser1);
			puzzle.addLaser(laser2);
			puzzle.addTarget(target);
			puzzle.addExit(exit);

			const puzzleSolver = new PuzzleSolver(puzzle);
			puzzleSolver.solve();

			assert.ok(puzzle.lasers['laser'].path, 'Laser should have a path assigned to it');
			assert.ok(puzzle.lasers['otherlaser'].path, 'Other laser should have a path assigned to it');
			assert.notOk(puzzle.targets['target'].isLit(), 'Target should not be lit');
			assert.notOk(puzzle.targets['target'].isStruckBy(TestHelper.laserColors.red), 'Target should not be struck by red laser');
			assert.notOk(puzzle.exits['exit'].isOpen, 'Exit should not be open');
		});

		QUnit.test('puzzle solved when same colors cross', (assert) => {
			let puzzle = TestHelper.createPuzzle();
			puzzle.setTranslation({ x: 0, y: 0 });

			let laser1 = TestHelper.createLaser({
				direction: TestHelper.directions.east,
				position: { x: 50, y: 50 },
				dimensions: { width: 0, height: 0 },
			});

			let laser2 = TestHelper.createLaser({
				key: 'otherlaser',
				position: { x: 80, y: 10 },
				dimensions: { width: 0, height: 0 },
				color: TestHelper.laserColors.red,
				direction: TestHelper.directions.south,
			})

			let target = TestHelper.createTarget({
				position: { x: 100, y: 55 },
				dimensions: { width: 20, height: 20 },
			});

			let exit = TestHelper.createExit({
				direction: TestHelper.directions.east,
				position: { x: 100, height: 190},
				dimensions: { width: 10, height: 10 },
			});

			puzzle.addLaser(laser1);
			puzzle.addLaser(laser2);
			puzzle.addTarget(target);
			puzzle.addExit(exit);

			const puzzleSolver = new PuzzleSolver(puzzle);
			puzzleSolver.solve();

			assert.ok(puzzle.lasers['laser'].path, 'Laser should have a path assigned to it');
			assert.ok(puzzle.lasers['otherlaser'].path, 'Other laser should have a path assigned to it');
			assert.ok(puzzle.targets['target'].isLit(), 'Target should be lit');
			assert.ok(puzzle.targets['target'].isStruckBy(TestHelper.laserColors.red), 'Target should be struck by red laser');
			assert.ok(puzzle.exits['exit'].isOpen, 'Exit should be open');
		});
	})

});