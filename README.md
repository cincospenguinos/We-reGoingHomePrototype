# We're Going Home--Prototype

Prototype of a game Stefano and I are making.

## Important Notes

These are important notes about the project that **MUST NEVER BE DELETED:**

* Puzzles always, **always** have a 4:3 aspect ratio. Going from puzzle to room must respect that
	* This does mean that changing room size will change very little when it comes to gameplay while traversing a room. We may want to experiment with other room sizes and static sprites for traversal sections
* Rooms in `TopDownScene` must always have a single tile of padding on the left, one on the right, one on the bottom, and two on the top

## TODO

- [ ] Create dungeon of puzzles
- [ ] Playtest and fix bugs

## The Story

This is a bit of a sci-fi game, with some sci-fi elements. That said, the sci-fi parts of the story are kept to a minimum for the most part.

### Background

A long time ago, an alien race came from a distant planet to Earth. This alien race was benevolent. The learned the languages of the people on the planet, and traded technology and knowledge with them. As a symbol of the warm feelings between the two races, they created a massive tower that acted as a bridge between their two worlds. This tower was carved out of a giant tree, intermingled with pieces of digital technology developed by both races.

The King (that's you) was the Grand Architect over the tree. He designed the various systems and rooms to power the whole thing, and led the work in every which way (I'm imagining him in a masonic apron, worn in the third degree fashion.) The Queen reigned upon the throne, imagining designs and things which informed the King and led the pattern of the work, but also acted as the sustainer, ensuring that the tree ran smoothly (the King is a generative force, making and designing, while the Queen is a maintaining force, sustaining and preserving.)

Over a long period of time, humans succumbed to their tribalistic tendencies, proclaimed the aliens as an outgroup, and attempted to destroy the tree. The aliens fought them off, many dying as they attempted to protect the tower and flee earth to go back home.

The Queen ended up leaving as well. She and the King decided the best way to solve the current problem was to shutdown the bridge between the two worlds. The Queen left, leaving her two young sons and her husband back on earth, and the King promised that some day he would come back with their two sons.

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
	* He owns a little music box that plays a small melody his mother would sing to him. When he's feeling upset or scared, he will find a quiet place, pull out this box and wind it up and listen.
	* Jachin prefers nurture and warm words over playfulness

## Aesthetics

* The story should be told through the world alone. We should strive to design the different pieces of the world to depict and explain what happened before the beginning of the game
* Other elements that can't be explained through the world can be explained through brief flashbacks that play out as you move through rooms. Perhaps the first time you enter specific rooms show ghostly versions of yourself and the Queen and your two young sons living life in the tree. I would prefer not to take away control from the player though unless strictly necessary. I think it should be possible to play the game largely ignoring the story if you really wanted to. This is something that should be explored in a prototype though
* We will need to find a nice balance between conveying information textually and visually
	* Character and story information should be explained largely through visuals. I think understanding the backstory should be optional to playing the game, and the family moments you have with your kids should be 

## Mechanics

We can think of the mechanics of the game as a variety of separate pieces that interact with each other and build a larger, more interesting game. So let's break things down into separate pieces:

### Laser Puzzles

This is the core of the game, and was tested in our first prototype. You have laser puzzles that directly alter the game's layout.

### Caring for your kids

Your kids need food, water, shelter, discipline, and love from their dad. Going about and doing housework in the main hub of the game will mainly contribute to what ending you get and how your kids will grow up. Thus a variety of opportunities for dad moments will be available to you. They will happen more often during the evening when you get home from working on the tree. This will be something we will need to prototype.

### Scavenging, Growing, and Fixing

There are basic needs that you and your kids will need to fill, and the main ways of doing that are by scavenging (picking things up in the dungeons,) growing (maintaining a garden that gives you what you need,) and fixing things (this could be fixing various pieces of the hub of the game to make the housework segments easier or even largely unimportant.)

### Combat Encounters

Since we are drawing a lot off of Zelda and D&D, we may want to explore combat encounters in the game. It would add a decent amount of complexity, and may totally remove us from the experience we're trying to build, which is **FATHERHOOD**.

* I'm imagining a day/season/year cycle with the tree. Perhaps the rooms should change accordingly. That's something to play around with

## Ideas

- [ ] Rotate pieces of the puzzle on mouse scroll over
	* Some pieces can be rotated, some can be moved, and some select few can have both occur
	* I like this idea, but it will have to be hacked into Phaser 3. Perhaps I can code it up and submit a pull request.
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
- [ ] Certain puzzle pieces are locked onto a track and can only be moved within a certain zone
- [ ] Consider putting in a run button
- [ ] Add a mini-map. Large rooms will be much more challenging to navigate without one.
- [ ] We could have secret rooms or doors that open with specific targets to allow you to move from one dungeon to another
- [ ] Lasers could be specific colors, and when a target is hit by a laser, it lights up that color, but if it's hit by more than one color, it mixes the colors together to make a new color and that new color opens a door specific to that color

## Notes

* To add physics to an existing sprite, do `this.physics.add.existing(spriteHere)`
	* Seriously though: just [watch this](https://www.youtube.com/watch?v=55DzXMkCfVA)
* Use [this](https://www.mapeditor.org/)
* The canvas element is 800x600
* We need to think about what the purpose of each of the rooms is, how they should connect, and how they should interact with each other. The puzzles themselves provide a decent amount of things to play with, but we should also explore in our prototype how each of the rooms can be modified by interaction with other rooms
* [This](https://medium.com/@jerra.haynes/a-real-persons-guide-to-phaser-3-or-how-i-learned-to-stop-worrying-and-love-the-gun-part-1-9cc6361f377c) article is very insightful and will help you understand the various pieces of Phaser 3.
	* Turns out there's a game state store manager in Phaser 3. This article mentions it. Later down the road you should look into using it.
* [This](https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6) article goes over how to do tilemaps. Holy shit it's so helpful.
* The puzzle items will all be 32x32 when in puzzle mode, but will be 256x256 in large mode
	* **That is a scale of 8**. This is also subject to change.

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

### Things to teach to the player

- [ ] You must have the laser hit the target to go through the door
- [ ] You cannot cross the laser
- [ ] You can move puzzle pieces
- [ ] You can rotate puzzle pieces
- [ ] Mirrors redirect laser paths
- [ ] All the panels in the room modify the same room layout
- [ ] Lasers of similar colors may cross each other
- [ ] Lasers of different colors may NOT cross each other

### TODO from Tasha's playthrough

- [ ] Add more elements to the rooms
	- [ ] Walls that turn the room into mazes
	- [ ] Lasers of multiple colors
	- [ ] Doors that are tied to specific colors
	- [ ] Multiple targets that must be hit by multiple lasers