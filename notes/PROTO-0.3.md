# PROTO-0.3 Notes

**Question:** How does varying the room size affect solving puzzles?
**Question:** How does varying the room size influence dungeon design?

## Decisions

* Rooms that are given a puzzle must have the same aspect ratio between the two
	* Here's an example: a puzzle that is 800x600 can belong to a room that is 1000:750, because their aspect ratios are 4:3
	* A room cannot have a puzzle that does not fit its aspect ratio
	* One potential solution is trying [this out](http://labs.phaser.io/edit.html?src=src\scenes\drag%20scenes%20demo.js)
* Exits are tied to lasers, NOT targets. It doesn't matter what target is hit in a room--all that matters is the color of the laser that hits it.
	* This will give us a much larger space to explore
* The width and height of a puzzle must be divisible by 8
	* This is to ensure that we have enough tiles and shit

## Discoveries

* We can't move the images around in the PuzzleScene without altering where the various pieces of the puzzle sit
	* This is because the puzzle relies on the position of the sprite image, and modifying the position of the sprite image will change where the image will sit in the puzzle.
	* A potential solution is to have the PuzzleScene set its boundaries in the window according to the puzzle's dimensions, and then the panel scene is displayed over main gameplay scene
* Creating a "Model-View" architecture out of the puzzle pieces leads to cleaner code, but creates some unique issues:
	* There are magic numbers now for what frames do what when hovering over items. This should be cleaned up.
	* I believe there is a way to import a spritesheet and name each of the frames. Do research on this. That would make this code base a WHOLE lot cleaner to work with
* Holy shit test-driven development is the only way to make anything
	* Over and over again issues that I saw on the front end were discovered and fixed by referring back to the tests that I wrote and checking to make sure they were working properly
	* Always, always, **ALWAYS WRITE YOUR TESTS FIRST**, *then* go ahead with the implementation and images. This forces you to consider how you want your model to be designed and to check if that design is working properly
* So getting the various scenes to interact with each other is tricky. Figuring out good methods to handle that is something to think about for the main game
* 

## To Improve

* Large, open, empty spaces are terrible to explore
	* This can be mitigated by ensuring that various spaces are unique
	* When it comes to dungeon exploration, we may need to give a dungeon map
* Building the dungeon by editing a JSON file sucks
	* We need to build a level editor
* Having a highlight for sprites is helpful, but we could use a bit more in that department
* The puzzle screen should have a panel outline and it should fit in the middle of the screen
	* This can probably be done by having the puzzle scene fit to a specific size and then the scene can be translated whichever place it needs to be in
	* We may want to explore how to make a good puzzle screen border with a set of resizable puzzle dimensions
* Also, level design SUCKS in this current implementation. Consider making a little program that allows you to design puzzles super easily
* Right now exits are tied to laser keys, but instead we need to tie them to colors. That's something that should be included in the main game, but probably isn't necessary here

## What new questions should we try to answer?

* What does our new tilemap need to look like to make a unique and interesting dungeon?
* How can we help the player understand the space he/she moves in without providing a minimap of the room?
* What sorts of dungeon layouts can we make to make the space interesting to explore?