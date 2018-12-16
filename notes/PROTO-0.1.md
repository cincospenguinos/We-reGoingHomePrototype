# PROTO-0.1 Notes

**Question:** Is it fun to have puzzles that modify the room layout?

## Discoveries

* The core puzzles are fun and interesting
* Introducing new elements slowly and giving the player time to practice and improve is good
* There are some boundary cases for various puzzles
	* puzzle12 needs the target to be lowered by about 20 pixels

## To Improve

* The puzzle screens should probably indicate to the player where they and the panels are
	* The puzzle screen should not allow the player to exit if the player is getting hit by the laser
	* You should leave by pressing the Q key instead of clicking the red x
* The mechanics need to be conveyed in a clearer way
	* Mousing over should show what you can and can't move or rotate
	* There should be tooltip text to explain controls
	* Mousing over a panel should be lit up only if the player is close enough to interact with it (maybe)
* The top-down view isn't bad, but traversing should be done in a style more like *Enter the Gungeon*
* Collision detection between the laser and the player should exist
* Collision detection between the various puzzle objects should also exist

## What new questions should we try to answer?

* Can we make a top-down scroller in Phaser 3? If so, can we use the current architecture we've put together to accomodate it?
* What size should the player's sprite be for a top-down scroller?
* How can we teach the mechanics to the player in the least intrusive way possible?