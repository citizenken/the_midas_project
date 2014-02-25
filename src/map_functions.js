var width = Game.map_grid.width;
var height = Game.map_grid.height;

function createMap(map, width, height) {
	var mapArray = [];
	for (var x = 0; x < map.length; x++) {
		mapArray[x] = map[x].split("");
	}
	var edges = findEdges();
	parsemap(mapArray, edges);
}

function findEdges () {
	return {xEdges: [0, width - 1], yEdges: [0, height - 1]};
}

function parsemap (mapArray, edges) {
	var zones = Game.currentMap.zones;
	var occupiedSquares = [];
	var allObjects = [];
	for (var y = 0; y < mapArray.length; y++) {
		occupiedSquares[y] = [];
		for(var x = 0; x < mapArray[y].length; x++) {
			var newEntity;
			switch (mapArray[y][x]) {
				case 'f':
					newEntity = Crafty.e('Floor').at(x,y);
					occupiedSquares[y][x] = newEntity;
				break;
				case 'b':
					newEntity = Crafty.e('Button').at(x,y);
					occupiedSquares[y][x] = newEntity;
				break;
				case '@':
					if (Crafty('Player').length === 0) {
						Game.player = Crafty.e('Player, WhiteCharacter').at(x,y);
						Game.player.h = Game.map_grid.tile.height * 2;
						occupiedSquares[y][x] = false;
					}
				break;
				default:
					occupiedSquares[y][x] = false;
				break;
			}
		}
	}
	Game.currentMap.map = mapArray;
	Game.currentMap.occupiedSquares = occupiedSquares;
	Game.allObjects = allObjects;
}

/*function addVoid (newEntity, edges, x, y) {
	if (edges.xEdges.indexOf(x) > -1 || edges.yEdges.indexOf(y) > -1) {
		newEntity.addComponent('Void');
	}
}*/

function createZone(selfSceneString, topScene, botScene, leftScene, rightScene, portals) {
	return {
		selfSceneString: selfSceneString,
		topScene: topScene,
		botScene: botScene,
		leftScene: leftScene,
		rightScene: rightScene,
		portals: portals
	};
}

function createWorldMap() {
	return [
	['labLvl1']
	];
}

function changeMap (direction) {
	var currentMap = Game.currentMap;
	switch (direction) {
		case 'UP':
				currentMap.x -= 1;
				Crafty.scene('DesertZone');
				Game.player.y = Game.player.y = Game.height() - Game.map_grid.tile.height;
			break;
		case 'DOWN':
				currentMap.x += 1;
				Crafty.scene('DesertZone');
				Game.player.y = 0;
			break;
		case 'RIGHT':
				currentMap.y += 1;
				Crafty.scene('DesertZone');
				Game.player.x = 0;
			break;
		case 'LEFT':
				currentMap.y -= 1;
				console.log(currentMap);
				Crafty.scene('DesertZone');
				Game.player.x = Game.width() - Game.map_grid.tile.width;
			break;
	}
	return;
}