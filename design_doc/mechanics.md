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
6. A reflective surface will always cause the laser to either change directions.

## Traversal

The traversal sections are the other half of the main element. The layout of the room that you are in changes directly by changing the layout of the puzzle inside the room. The solution of the puzzle you discovered will influence how well you are to move from one end of the room to the other.

### Rules

1. The room cannot be altered by the player except by using a panel.
2. The player cannot cross any laser of any color for any reason whatsoever.
3. Any puzzle item in the room cannot be moved through by the player.
4. The player may enter the puzzle section to modify the room if and only if they choose to and are close enough to a panel to do so.
5. The player may travel to a new room through a door if and only if they move through it while it is open (e.g. they discovered a solution to the puzzle that makes a door's color match the target's color.)