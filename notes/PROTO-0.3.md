# PROTO-0.3 Notes

**Question:** How does varying the room size affect solving puzzles?
**Question:** How does varying the room size influence dungeon design?

## TODO

- [ ] Fix model to accomodate improvements discovered in PROTO-0.2.md
- [ ] Make dungeons that hold rooms that can hold puzzles--this will make rooms that only have a traversal segment easy to implement
- [ ] Ensure new model passes all the tests
- [ ] Create sprites for small puzzle items and large puzzle items
- [ ] Make the puzzle scene work properly for puzzles of various shapes and sizes

## Decisions

* Rooms that are given a puzzle must have the same aspect ratio between the two
	* Here's an example: a puzzle that is 800x600 can belong to a room that is 1000:750, because their aspect ratios are 4:3
	* A room cannot have a puzzle that does not fit its aspect ratio

## Discoveries

## To Improve

## What new questions should we try to answer?
