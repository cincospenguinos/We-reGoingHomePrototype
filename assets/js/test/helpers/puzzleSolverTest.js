/**
 * puzzleSolverTest.js
 */
import { TestHelper } from '../testHelper.js';
import { PuzzleSolver } from '../../src/helpers/puzzleSolver.js';

QUnit.module('PuzzleSolver', () => {
	QUnit.test('indicates that a puzzle is solved', (assert) => {
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
});