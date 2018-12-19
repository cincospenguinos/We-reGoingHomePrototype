# PROTO-0.3 Notes

**Question:** How does varying the room size affect solving puzzles?
**Question:** How does varying the room size influence dungeon design?

## TODO

- [x] Fix model to accomodate improvements discovered in PROTO-0.2.md
- [x] Make dungeons that hold rooms that can hold puzzles--this will make rooms that only have a traversal segment easy to implement
- [x] Ensure new model passes all the tests
- [ ] Create sprites for small puzzle items and large puzzle items
- [ ] Make the puzzle scene work properly for puzzles of various shapes and sizes

## Decisions

* Rooms that are given a puzzle must have the same aspect ratio between the two
	* Here's an example: a puzzle that is 800x600 can belong to a room that is 1000:750, because their aspect ratios are 4:3
	* A room cannot have a puzzle that does not fit its aspect ratio

## Discoveries

* So we can't move the images around in the PuzzleScene without altering where the various pieces of the puzzle sit
	* This is because the puzzle relies on the position of the sprite image, and modifying the position of the sprite image will change where the image will sit in the puzzle.
	* A potential solution is to have the PuzzleScene set its boundaries in the window according to the puzzle's dimensions, and then the panel scene is displayed over main gameplay scene

## To Improve

## What new questions should we try to answer?
