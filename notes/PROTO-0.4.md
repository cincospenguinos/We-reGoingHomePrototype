# PROTO-0.4.md

**Question:** How does modifying the puzzle so that color determines movement change the dungeon design?
**Question:** How can we effectively communicate how to play to the player, using separate perspectives or methods?

## Decisions

* TopDownScene now exclusively interacts with rooms, and PuzzleScene now exclusively interacts with puzzles
	* This will make switching between the two scenes much more seamless
	* This also makes the code for TopDownScene enormously better to look at--simpler, smaller, and easy
	* Note that the dungeon JSON file now requires all puzzle items to include what class they belong to
* Rooms defined in the JSON file have dimensions that **do not include** the padding of the rooms themselves
	* This makes the conversion from puzzle to room and back a lot easier
* Puzzles must fit within the canvas element for now
	* We may want to explore being able to zoom in and out of the puzzle scene, as well as scrolling through it. This adds complexity for us, but would give us an even wider design space to explore when it comes to dungeon and puzzle design.
* Instead of an "exit puzzle" button you click on, you hit the escape key to exit the puzzle
	* This means that everything visible to the player is potentially interactable
	* This also removes issues of the puzzle pieces being under or over the exit button
* Only lasers and mirrors are movable and rotatable right now
	* I want things to be easy on the player, and this is one way of ensuring that that's the case

## Discoveries

* [Javascript has a means of deleting objects!](https://stackoverflow.com/questions/864516/what-is-javascript-garbage-collection)
	* Use the `delete` keyword to do it
	* When optimizing the game to improve performance, this is something we will take advantage of


## To Improve

* The doors look amazing, but they need to fit within the walls of a given room
	* Explore Tiled and its documentation. There is probably a way to add separate sprites into a map that allows us to do what we want without having to slap a sprite on top of everything else
* We need to find a way to communicate to the player what they need to do
	* I'm imagining words appearing on screen when you get close to something

### Notes from Tasha's Playtest 1

* Communicating what to do to the player is a big problem
	* Tasha appreciated highlighting something white to indicate that it could move (the panel was immediately recognizable in its interactability for that reason)
	* Tasha was incredibly frustrated that moving the laser wasn't immediately explained to her
* The puzzle scene is too small
	* Having to move tiny elements in a tiny space isn't fun to Tasha
	* Given how intense we want this game to be, that's something we should really adjust. Perhaps setting the scale to 4 would improve things in that department.
* The puzzle scene needs to be moved to the center of the screen
	* There is a way for Phaser to do this--it just needs to be done

### Notes from Zachie's Playtest 1

* The puzzle scene pieces are too small
* Instructions on how to play are needed
	* Maybe just a quick text bit that shows up and says "WASD to move" and "click to interact"
	* Maybe a little splash screen that says how to play really fast
* The collisions are wonky
	* Puzzles are considered valid even when pieces run into each other. That can't happen anymore
* Definitely has promise (according to Zachie)

### Notes from Tasha's Playtest 2

* The current design is confusing and not helpful
	* The laser is already hitting the target
	* The target is in front of the door
* Mouse pointers and changing those things makes things significantly better
* Message system is a good addition
* Maybe make it even more obvious what you can do in the puzzle scene?
* The tilemap is broken

## What should we try to answer next?

* What other elements/barriers should we incorporate to make more interesting dungeons?
	* Keys for doors
	* Hitting switches/panels/buttons in different rooms
	* A big key for a main door
	* Walls or other things that prevent movement
	* Timer puzzles, with light hitting a different type of target
	* Moving items into different places--onto switches, into corners, into lasers!