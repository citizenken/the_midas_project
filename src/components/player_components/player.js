Crafty.c('Player', {
	_activeItem: 'Sword',
	_currentLocation: null,
	_currentZone: {x:null, y:null},
	_direction: 'DOWN',
	_followers: [1,1,1,1,1,1,1,1],
	_hitPoints: 30,
	_items: ['Sword', 'Sling', 'Lance', 'EmptyWaterBag'],
	_jumpSpeed: 4,
	_justTriggeredScene: false,
	_money: 000000000000,
	_moveSpeed: 4,
	_nextLocation: null,
	_playerHUD: null,
	_previousLocation: null,
	_water: 30,
	_tradeItems: [],
	init: function() {
		this.requires('Actor, Twoway, Collision, Delay, Persist, Solid, Color, Gravity')
			.color('black')
			.gravity('Floor')
			// .gravityConst(0.2)
			// ._playerHUD = Crafty.e('HUD');
			// this.attach(this._playerHUD);
			.twoway(this._moveSpeed, this._jumpSpeed)
			.bind('EnterFrame', function(data) {
				this.checkDead();
				// this.updateHUD();
			})
			.bind('KeyDown', function(e) {
				switch (e.key) {
					case Crafty.keys.UP_ARROW:
						Game.playerKeys.UP_ARROW = true;
						break;
					case Crafty.keys.RIGHT_ARROW:
						Game.playerKeys.RIGHT_ARROW = true;
						break;							
					case Crafty.keys.R:
						this.fourway(this._moveSpeed * 4);
						break;
					case Crafty.keys.SPACE:
						Game.playerKeys.SPACE = true;
						this.itemRouter();
						break;
					case Crafty.keys.E:
						Game.playerKeys.E = true;
						break;
					case Crafty.keys.Y:
						Game.playerKeys.Y = true;
						this.changeItem();
						break;
					case Crafty.keys['1']:
						Game.playerKeys['1'] = true;
						this.selectTradeItem(0);
						break;
					case Crafty.keys['2']:
						Game.playerKeys['2'] = true;
						this.selectTradeItem(1);
						break;
					case Crafty.keys['3']:
						Game.playerKeys['3'] = true;
						this.selectTradeItem(2);
						break;
					case Crafty.keys['3']:
						Game.playerKeys['3'] = true;
						this.selectTradeItem(2);
						break;
					case Crafty.keys.T:
						Game.playerKeys.T = true;
						var items = Game.player._playerHUD._tradeItemsEntities;
						var selectedItem = items.indexOf(Crafty('SelectedTradeItem'));
						if (selectedItem > -1) {
							items[selectedItem].removeComponent('SelectedTradeItem');
							items[selectedItem].css({
								border: 'solid black 2px',
								'border-radius': '5px'
							});
							var droppedItem = Crafty.e(this._tradeItems[selectedItem] + ',TradeItem, Dropped');
							droppedItem.x = this.x;
							droppedItem.y = this.y;
							this._tradeItems[selectedItem] = null;
						}
						break;
					}
			})
			.onHit('Dropped', function() {}, function () {
				Crafty('Dropped').removeComponent('Dropped');
			})
			.bind('KeyUp', function(e) {
				switch (e.key)
				{
					case Crafty.keys.UP_ARROW:
						Game.playerKeys.UP_ARROW = false;
						break;
					case Crafty.keys.RIGHT_ARROW:
						Game.playerKeys.RIGHT_ARROW = false;
						break;							
					case Crafty.keys.R:
						this.fourway(1);
						break;
					case Crafty.keys.E:
						Game.playerKeys.E = false;
						break;
					case Crafty.keys.SPACE:
						Game.playerKeys.SPACE = false;
						break;
				}
			})
			.onHit('SandDune', function(data) {
				if (this._speed.x == this._moveSpeed || this._speed.y == this._moveSpeed) {
					this.fourway(this._moveSpeed/2);
				}
			})
			.onHit('Actor', function(data) {
				var hitObject = data[0].obj;
				var hitObjectType;
				if (hitObject.has('Void')) {
					hitObjectType = 'Void';
				} else if (hitObject.has('Floor')) {
					hitObjectType = 'Floor';                    
				}
				this.collisionHandler(hitObjectType, hitObject);
			})
			.bind('Moved', function(data) {
				this._previousLocation = data;
				this._currentLocation = {x:this.x, y:this.y};
				this._nextLocation = {x:this.x + this._movement.x, y:this.y + this._movement.y};
			})
			.bind('NewDirection', function(data) {
				if (data.y === -1 || data === 'UP') {
					this._direction = 'UP';
				} else if (data.y === 1 || data === 'DOWN') {
					this._direction = 'DOWN';
				} else if (data.x === 1 || data === 'RIGHT') {
					this._direction = 'RIGHT';
				} else if (data.x === -1 || data === 'LEFT') {
					this._direction = 'LEFT';
				}
			});
	},

	collisionHandler: function(hitObjectType, hitObject) {
		switch (hitObjectType) {
			case 'Void':
				if (this.x === hitObject.x || this.y === hitObject.y) {
					if (this._justTriggeredScene === false) {
						this._justTriggeredScene = true;
						changeMap(this._direction);
						this._justTriggeredScene = false;
					}
				}
			break;
			case 'Well':
				if (this.steps > 0) {
					this.steps = 0;
				}
				this._speed = 0;
				if (this._movement) {
				  this.x -= this._movement.x;
				  this.y -= this._movement.y;
				}
				if (this._activeItem === 'EmptyWaterBag' && this._items.indexOf('EmptyWaterBag') > -1) {
					this._water = 30;
					this._items[this._items.indexOf('EmptyWaterBag')] = 'WaterBag';
					this._activeItem = 'WaterBag';
				} else {
					this._water = 30;
				}
			break;
			case 'Scenery':
				this._speed = 0;
				if (this._movement) {
				  this.x -= this._movement.x;
				  this.y -= this._movement.y;
				}
			break;
			case 'Floor':
				this._speed = 0;
				if (this._movement) {
				  this.x -= this._movement.x;
				}
				if (this._movement.y !== (this._moveSpeed * -1)) {
				  this.y -= this._movement.y;
				}
			break;
			case 'Camel':
				if (Game.playerKeys.M) {
					this.mount(data);
				}
			break;
			case 'TradeItem':
			// console.log(this._tradeItems.length);
				if (this._tradeItems.length < 3) {
					this._tradeItems.push(hitObject._itemType);
					hitObject.destroy();
				} else if (this._tradeItems.indexOf(null) > -1) {
					var nullSpace = this._tradeItems.indexOf(null);
					this._tradeItems[nullSpace] = hitObject._itemType;
					hitObject.destroy();
				}
			break;
		}
	},

	checkAdjacent: function() {
		var currentSquare = {x:Math.floor(this.at().x), y:Math.floor(this.at().y)};
		if (Game.currentMap.occupiedSquares[currentSquare.y - 1][currentSquare.x]) {
			var squareUp = Game.currentMap.occupiedSquares[currentSquare.y - 1][currentSquare.x].type;
		}
		if (Game.currentMap.occupiedSquares[currentSquare.y + 1][currentSquare.x]) {
			var squareDown = Game.currentMap.occupiedSquares[currentSquare.y + 1][currentSquare.x];
		}
		if (Game.currentMap.occupiedSquares[currentSquare.y][currentSquare.x + 1]) {
			var squareRight = Game.currentMap.occupiedSquares[currentSquare.y + 1][currentSquare.x];
		}
		if (Game.currentMap.occupiedSquares[currentSquare.y][currentSquare.x - 1]) {
			var squareLeft = Game.currentMap.occupiedSquares[currentSquare.y + 1][currentSquare.x];
		}
		return [squareUp, squareDown, squareRight, squareLeft]
	},
});
