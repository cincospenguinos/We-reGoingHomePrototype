# Notes on Sprites

Stefano, these are so awesome! I've taken the ones that fit perfectly with my current code to use immediately. The ones that are left in this directory (as well as the tilesheet) have some things that need adjusting according to the ever-changing rules of the game (sorry about that!)

## Exit

The exit is actually perfect the way it is. I just need to change my code to adjust to its design.

## Lasers

I love how we have multiple colors of lasers. For the demo though, we will probably only use red lasers (for now.) When the player is modifying the puzzle though, we need to have a way to indicate to them that they can change things. Hence I created a simple color scheme: blue to move, red to rotate, and purple for both. The lasers don't follow that color scheme. Could we have four different sprites of the red laser, but with a single pixel outline for three of those sprites, one for each of those colors? That way we can easily indicate to the player what they can and can't interact with.

Alternatively, we could have just a simple white outline for either movement or rotation, but the fact that both are conflated may be frustrating for the player. We will need to experiment. I think I would prefer a white outline though because color plays such an integral role in the puzzle element of the game.

## Targets

I love the target designs so much! I love the color scheme you adopted! I actually need the target to only have one off state (denoted by a gray or black center) and an on state for each color (the ones you've already provided are perfect for that.) That will leave five total sprites for this spritesheet.

## Main Character

I think the main character's design is great! I like how he turned out. The side view of him though looks a bit off to me, as if his feet are a couple pixels too far forward. Can we make him stand up straight?

Don't worry about animating him right now though. We should experiment with getting his look down and observing how he fits with the rest of the setting.

## The Tilesheet

Again, I love how you designed the walls. I love the aesthetics. I think it fits with the tone of the game, the story and lore, and will add to the user's experience. I'm not sure what a few of the tiles are though. I'll need you to sit down with me and explain what some of them are. Mostly the brown ones--are they tree roots or are they paths? Does it depend on which one? If one set is a root and another is a path, can we adjust their colors to make the roots darker?

Also, I worry about some of the walls with their designs matching up with each other. Perhaps I need to tinker with it, but that's something we will need to keep in mind.

## Large-scale Versions

For each item that appears in the puzzle, we will need another sprite that is eight times the size. In the `sprites` directory, you'll see two folders: `puzzle` and `room`. All of the sprites in `puzzle` appear when you interact with a panel, and represent each of the different puzzle pieces. All of the sprites in `room` are eight times the size and only have elements in their spritesheets that are needed. No outlines to indicate interaction are necessary with those sprites.

## Closing

These are so awesome. I love them so much. Keep up the good work!
