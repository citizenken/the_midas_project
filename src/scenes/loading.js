// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
  // Draw some text for the player to see in case the file
  //  takes a noticeable amount of time to load
  Crafty.e('2D, DOM, Text')
	.text('Loading; please wait...')
	.attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
	.css($text_css);

  // Load our sprite map image
  Crafty.load([
	'assets/actors/human.png',
	], function(){
	// Once the images are loaded...

	// Define the PC's sprite to be the first sprite in the third row of the
	//  animation sprite map
	Crafty.sprite(64, 64, 'assets/actors/human.png', {
		spr_human:  [0, 10, 0, 0]
	  });

	// Now that our sprites are ready to draw, start the game
	Crafty.scene('LabLvl1');
  })
});