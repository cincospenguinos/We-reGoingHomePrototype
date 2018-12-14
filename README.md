# We're Going Home--Prototype

Prototype of a game Stefano and I are making.

## The Story

This is a bit of a sci-fi game, with some sci-fi elements. That said, the sci-fi parts of the story are kept to a minimum for the most part.

### Background

A long time ago, an alien race came from a distant planet to Earth. This alien race was benevolent. The learned the languages of the people on the planet, and traded technology and knowledge with them. As a symbol of the warm feelings between the two races, they created a massive tower that acted as a bridge between their two worlds. This tower was carved out of a giant tree, intermingled with pieces of digital technology developed by both races.

Over a long period of time, humans succumbed to their tribalistic tendencies, proclaimed the aliens as an outgroup, and attempted to destroy the tree. The aliens fought them off, many dying as they attempted to protect the tower and flee earth to go back home.

In the midst of the battle, the King and his two sons ran away and hid. After centuries after the attack they decided to go back to the tower to try going home once more.

### The Game

You begin as the King, wandering back to the tower with his two sons, Boaz and Jachin (not their actual names--just the names I'm assigning to them.) As king, you have intimate knowledge of the various pieces of the tower and how to repair and power them once more. You go inside, solving the different puzzles and fixing the tower, and come across things from back home that you can give to your kids to help them learn about where they came from. Periodically you'll catch them quarelling, or talking together, or playing with each other, and you can intervene in a variety of ways that influences the ending.

### The End

After repairing all the pieces and getting the tower to work, you bring your sons up to the main bridge where you are faced with one last big puzzle (which may or may not require your son's help--I haven't decided.) Upon finishing that, you are able to send your kids back home. The catch is the tower can only power two people to go back, meaning you have to leave one of you three behind. Who that person is depends on how you interacted with your sons thorughout the game.

### The Characters

The characteristics of each of the characters are pretty simple. I want to make use of [the masking effect](https://en.wikipedia.org/wiki/Masking_(illustration)) to make the player sink in and take upon themselves the role of each of them in different ways. Hence I want their sprites to be highly animated, but simple in its depiction of facial features and personhood.

* The King
* Boaz
	* Boaz is the older one
* Jachin
	* Jachin is the younger one
	* He owns a little music box that plays a small melody his mother would sing to him. When he's feeling upset or scared, he will find a quiet
	place, pull out this box and wind it up and listen.

## Ideas

- [ ] Rotate pieces of the puzzle on mouse scroll over
- [ ] Allow for eight directions instead of the cardinal four
- [ ] Have lasers be determined by their colors, and do not allow lasers to cross each other
- [ ] Allow surfaces to reflect from certain sides of themselves, or have it change depending on the direction the light comes from
- [ ] Allow puzzles to have multiple targets
- [ ] Mousing over something movable in the puzzle causes an outline to appear
- [ ] Moving lasers--this gives us a way to make the transversive sections more engaging.
- [ ] There should be some sort of cue to the player when they solve the puzzle

## Notes

* To add physics to an existing sprite, do `this.physics.add.existing(spriteHere)`
	* Seriously though: just [watch this](https://www.youtube.com/watch?v=55DzXMkCfVA)
* Use [this](https://www.mapeditor.org/)
* The canvas element is 800x600
* USE JSON FILES TO KEEP PUZZLE DATA! Instead of a "PuzzleHelper", just put all that data into a JSON file and then
make a static method on Puzzle take that data and convert it to a game object.