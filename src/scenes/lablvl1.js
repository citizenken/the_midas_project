Crafty.scene('LabLvl1', function() {
	var currentMap = Game.currentMap;
	var sceneMap = window[Game.worldMap[currentMap.x][currentMap.y]];

	createMap(sceneMap, Game.map_grid.width, Game.map_grid.height);
	// if (Crafty.mobile) {
		Crafty.e('JSBase');
	// }
	// Game.mouselayer = Crafty.e('MouseLayer');
	// Crafty.viewport.init(600, Game.height());
	Crafty.viewport.centerOn(Crafty('Player'));
	Crafty.viewport.follow(Crafty('Player'));
});