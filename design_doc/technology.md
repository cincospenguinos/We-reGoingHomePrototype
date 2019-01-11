# Technology

## Level Editor

The level editor should allow the user to do the following:

* Set the puzzle's dimensions
* Change the puzzle's key
* Display the room's necessary dimensions in tiles
* Place puzzle pieces onto the room and edit their properties
* Export the puzzle as JSON to the user in some way

## Sprites

The organization of the sprite sheets is important. Here's some notes on that:

* If the thing that the sprite presents has a color property (lasers, exits, targets, etc.) then the sprite sheet should be arranged in order of the following colors:
	1. Red
	2. Green
	3. Blue
	4. Orange
	5. Purple
	6. Yellow
	7. White
* Things with color properties and different states should be included in similar columns. As an example:
	* A laser has a movable and rotatable property. So each column should be a different color, and each row should be a different permutation of the property. That means col1 is red, col2 is green, etc., and row1 is non-movable laser, row2 is movable, row3 is rotatable, and row4 is movable and rotatable
* Sprites are put into separate directories in the `assets/sprites` directory
	* `room` is for sprites of the various room objects
	* `puzzle` is for sprites of the various puzzle objects
	* `tilesheets` is for tilesheets that are viewed in the TopDownScene
	* `unused` is for any sprites that I like but aren't using right now for any reason