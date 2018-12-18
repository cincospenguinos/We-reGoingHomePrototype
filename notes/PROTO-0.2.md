# PROTO-0.2 Notes

**Question:** Is it possible and pragmatic to have a top-down view for the puzzles?

## Discoveries

* Scaling up from the puzzle size to the movement view works, but enforces a very strict set of dimensions
* The things we want to do are possible through the technology Phaser has for us

## To Improve

* The model needs to be adjusted to accomodate the changes in the puzzle format
	* Puzzles should be of any size, regardless of the room size
	* Puzzle items should be very specific sizes--like 
	* Puzzles can have multiple lasers
	* Doors must be tied to specific lasers (this will help the laser/target phenomenon)
	* Puzzles may have more than one target
* There should be static sizes for the various pieces
	* PuzzleScene items should always be 16x16, 32x32, etc.
	* Their larger equivalents should always be some scalar amount greater than themselves
	* Dimensions of the room should vary by the puzzle, which can be managed through Tiled
* You should be able to see where you are on the puzzle screen. This will make it a whole lot easier to manage things

## What new questions should we try to answer?

* Can we vary the size of the rooms? How would that affect dungeon design?
* How can we ensure static sizes of the large-scale puzzle pieces and then scale the smaller ones for the puzzle scene?
* What does a minimap need to look like to effectively show the player the whole room at a glance?