# Mechanics

There are multiple pieces of the game that interact with each other. They all intersect at a single element of the game though, and that is the puzzle section.

## Puzzle

The puzzle sections are half of the main element of the game. Each puzzle has a single goal: **get the laser matching the door you want to go through to hit the target.** The door only opens if the target in the room matches that laser.

### Rules

1. A laser always travels in the direction it is facing or moving until it is terminated by a surface.
2. A target struck by a laser will light up to that color.
3. A door whose color matches the target in the room will open only for that color, and for none other.
4. A target struck by multiple lasers will blend into a new color.
5. An opaque surface will always cause the laser to terminate.
6. A reflective surface will always cause the laser to either change directions or terminate, depending on where the surface is facing.
7. A laser cannot cross with another laser of another color, but may cross with a laser of the same color.

### Color Blending

Since colors can be blended together, it is important to remember what colors blend to what.

* RED + GREEN = ORANGE
* RED + BLUE = PURPLE
* GREEN + BLUE = YELLOW
* RED + GREEN + BLUE = WHITE

A target may be hit by multiple copies of the same color, but will still act as if it was only hit by one color.

## Traversal

The traversal sections are the other half of the main element. The layout of the room that you are in changes directly by changing the layout of the puzzle inside the room. The solution of the puzzle you discovered will influence how well you are to move from one end of the room to the other.

### Rules

1. The room cannot be altered by the player except by using a panel.
2. The player cannot cross any laser of any color for any reason whatsoever.
3. Any puzzle item in the room cannot be moved through by the player.
4. The player may enter the puzzle section to modify the room if and only if they choose to and are close enough to a panel to do so.
5. The player may travel to a new room through a door if and only if they move through it while it is open (e.g. they discovered a solution to the puzzle that makes a door's color match the target's color.)

## Caring for your kids

You have two sons (the game refers to them as "your younger one" and "your older one.") The whole purpose of the game is to care for you kids. How you care for your kids determines the end of the game (see [story.md](story.md) for details.)

NOTE: This is something you will want to prototype when you're building the full version of the game.

### The Children's Needs

You properly care for your sons by filling their needs. You fill their needs by acquiring things, using things, fixing things, and performing menial chores for your children.

Your kids have a few basic needs:

1. Physical needs
	* Food (they need one meal a day to survive)
	* Water (they need to get water multiple times a day to survive)
2. Security
	* A warm home (available to be built)
	* A comfortable and warm place to sleep
	* A clean environment to stay in
3. Love and Belonging
	* Regular embrace from Dad
	* Acts of service (cleaning up after your kids)
4. Esteem
	* Opportunities to do things on their own
	* Encouragement and praise from Dad
5. Self-Actualization
	* Instruction for new skills development
	* Opportunities for self-guided work and maintenance

I'm still working out in my head how I would design this, but my idea is this:

* Each of those four needs has a point value associated with it--essentially it's a hidden stat.
	* Whenever you do a thing for your kids (feed them, clothe them, build them a nice bed, repair the machine chef, take them out to the park) it increases that stat
	* If their stats are high enough, you'll have opportunities to instruct them in different things
	* Instruction drops a few stats in security and love/belonging, but ups permanent skills for the kids
	* If the permanent skills are high enough, you will have the opportunity to unlock one of the other endings
* There is an overall "love" stat (hidden from the player) that determines your relationship with that son
	* This stat is a mixture of all the other four stats
	* This stat is the determining factor for which ending you get
* Your kids start with their physical needs filled. These deplete with every passing few hours.
* The hub area has pieces that you can repair with different items and resources to provide a better living space for your kids
* You may catch your kids doing different things at different times, and you can intervene to get "bonus points" to various categories of their scores.
	* They may bicker or fight, and you can break up the fight and make them apologize
	* You can encourage one to go play or comfort the other
	* You can give them something they are obviously reaching for (water, food, a cool thing, etc.)
	* Objects of theirs may break and repairing them requires resources that you have to go collect, and then spend time to fix
* Your main antagonists when caring for the kids are time and entropy
	* You have a limited amount of time to do things for your kids, and the end of the game is dependent upon you getting your ass through the dungeons, so you need to balance things to accomodate
	* Things around the house may break, and food needs to be replenished, and chores need to be done