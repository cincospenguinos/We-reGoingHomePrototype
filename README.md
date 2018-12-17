# We're Going Home--Prototype

Prototype of a game Stefano and I are making.

## The Story

This is a bit of a sci-fi game, with some sci-fi elements. That said, the sci-fi parts of the story are kept to a minimum for the most part.

### Background

A long time ago, an alien race came from a distant planet to Earth. This alien race was benevolent. The learned the languages of the people on the planet, and traded technology and knowledge with them. As a symbol of the warm feelings between the two races, they created a massive tower that acted as a bridge between their two worlds. This tower was carved out of a giant tree, intermingled with pieces of digital technology developed by both races.

Over a long period of time, humans succumbed to their tribalistic tendencies, proclaimed the aliens as an outgroup, and attempted to destroy the tree. The aliens fought them off, many dying as they attempted to protect the tower and flee earth to go back home.

In the midst of the battle, the King and his two sons ran away and hid. Centuries after the attack they decided to go back to the tower to try going home once more.

### The Game

You begin as the King, wandering back to the tower with his two sons, Boaz and Jachin (not their actual names--just the names I'm assigning to them.) As king, you have intimate knowledge of the various pieces of the tower and how to repair and power them once more. You go inside, solving the different puzzles and fixing the tower, and come across things from back home that you can give to your kids to help them learn about where they came from. Periodically you'll catch them quarelling, or talking together, or playing with each other, and you can intervene in a variety of ways that influences the ending.

### The End

After repairing all the pieces and getting the tower to work, you bring your sons up to the main bridge where you are faced with one last big puzzle (which may or may not require your son's help--I haven't decided.) Upon finishing that, you are able to send your kids back home. The catch is the tower can only power two people to go back, meaning you have to leave one of you three behind. Who that person is depends on how you interacted with your sons thorughout the game.

### The Characters

The characteristics of each of the characters are pretty simple. I want to make use of [the masking effect](https://en.wikipedia.org/wiki/Masking_(illustration)) to make the player sink in and take upon themselves the role of each of them in different ways. Hence I want their sprites to be highly animated, but simple in its depiction of facial features and personhood.

* The King
* Boaz
	* Boaz is the older one
	* Boaz is capable of taking care of himself for the most part. He exhibits a great amount of independence.
	* Boaz prefers physical play and interaction over nurture
* Jachin
	* Jachin is the younger one
	* He owns a little music box that plays a small melody his mother would sing to him. When he's feeling upset or scared, he will find a quiet
	place, pull out this box and wind it up and listen.
	* Jachin prefers nurture and warm words over playfulness

## Ideas

- [ ] Rotate pieces of the puzzle on mouse scroll over
	* Some pieces can be rotated, some can be moved, and some select few can have both occur
- [ ] Allow for eight directions instead of the cardinal four
- [ ] Have lasers be determined by their colors, and do not allow lasers to cross each other
- [ ] Allow surfaces to reflect from certain sides of themselves, or have it change depending on the direction the light comes from
- [ ] Allow puzzles to have multiple targets
- [ ] Mousing over something movable in the puzzle causes an outline to appear
- [ ] Moving lasers--this gives us a way to make the transversive sections more engaging.
- [ ] Lasers that are timed--on for three seconds, off for three seconds, on again, off again, etc.
- [ ] There should be some sort of cue to the player when they solve the puzzle
- [ ] You should be able to teleport via a map. Perhaps every room has a teleport spot, by one or each door.
	* This could break the game though. This is something to explore in one of the prototypes
- [ ] As you move through the different rooms, you pick up items
	* Some items help you repair various pieces of other rooms, which accesses the final puzzle of an area that powers that area
	* Some items are human things that you can give to your kids
	* Some items are alien things that you can give to your kids
	* Some items are keys to unlock secret areas
- [ ] Maybe one or both of your kids can learn how to cook for themselves instead of relying on you--perhaps that is something that can be taught

## Notes

* To add physics to an existing sprite, do `this.physics.add.existing(spriteHere)`
	* Seriously though: just [watch this](https://www.youtube.com/watch?v=55DzXMkCfVA)
* Use [this](https://www.mapeditor.org/)
* The canvas element is 800x600
* We need to think about what the purpose of each of the rooms is, how they should connect, and how they should interact with each other. The puzzles themselves provide a decent amount of things to play with, but we should also explore in our prototype how each of the rooms can be modified by interaction with other rooms
* [This](https://medium.com/@jerra.haynes/a-real-persons-guide-to-phaser-3-or-how-i-learned-to-stop-worrying-and-love-the-gun-part-1-9cc6361f377c) article is very insightful and will help you understand the various pieces of Phaser 3.
	* Turns out there's a game state store manager in Phaser 3. This article mentions it. Later down the road you should look into using it.
* [This](https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6) article goes over how to do tilemaps. Holy shit it's so helpful.

### Design Notes

* There's two main components: moving through the various dungeons and solving the puzzles, and taking care of your sons
	* Taking care of your sons determines the ending
		* Boaz can grow up to help you with some of the puzzles
		* How you raise them changes the ending
		* There is no way to intentionally hurt your children. No physical punishments, no combat (if any is in the game) is allowed in the same room as them, etc. The only thing you can do is to neglect their needs, which will certainly result in them leaving without you
	* You can repair various rooms of the tree that help you with parenting bits
		* There's a day/night cycle that you need to keep up with
		* You need to feed your kids every day
		* Spending time with them helps them grow too
		* You need to build them structures and things to make them happy
		* Sometimes their toys break and you can spend your parts to fix them
* There should be a map to see the room layout without having to access the panel
	* This could be a setting--the size of a mini-map, or something
	* Accessing a panel is the only way to modify the room
* Maslow's Hierarchy of Needs
	* You need to get food and shelter for your kids, but also yourself
	* There are items that you can use to fix various areas in the main bridge where your kids are staying, creating an automated food service, 

### Notes from Tasha's first playthrough

* The current sprites that I made do not convey information well to the user
* The green things are panels, and Tasha had no clue about that
* You had to be too close to the panels to use them--so adjust that
* The jump in difficulty between the first and second puzzle was too sudden
* Do we have to change modes? It wasn't obvious
* It has promise though--Tasha wishes there were more levels
* Directions are unclear during puzzle2

### Things to teach to the player

- [x] You must have the laser hit the target to go through the door
- [x] You cannot cross the laser
- [x] You can move puzzle pieces
- [x] You can rotate puzzle pieces
- [ ] Mirrors redirect laser paths
- [ ] All the panels in the room modify the same room layout
- [ ] Lasers of similar colors may cross each other
- [ ] Lasers of different colors may NOT cross each other

### TODO from Tasha's playthrough

- [x] Setup way to maintain room state
- [x] Make the various pieces of the puzzle smaller
- [x] Add more puzzles
- [x] Ease the player into puzzle1--maybe have a couple rooms with two panels
- [ ] Create new set of sprites that depict information in a more clear way
- [ ] Add more elements to the rooms
	- [ ] Walls that turn the room into mazes
	- [ ] Lasers of multiple colors
	- [ ] Doors that are tied to specific colors
	- [ ] Multiple targets that must be hit by multiple lasers