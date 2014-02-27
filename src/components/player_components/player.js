Crafty.c('Player', {
	_activeItem: 'Sword',
	_activeMode: 'add',
	_addingGold: false,
	_armLocation: null,
	_arm: null,
	_removingGold: false,
	_adjacent: null,
	_currentLocation: null,
	_currentZone: {x:null, y:null},
	_direction: 'RIGHT',
	_hitPoints: 30,
	_goldLevel: 5,
	_items: [],
	_jumpSpeed: 8,
	_justTriggeredScene: false,
	_modes: ['none', 'add', 'remove'],
	_money: 000000000000,
	_moveSpeed: 4,
	_nextLocation: null,
	_playerHUD: null,
	_previousLocation: null,
	_water: 30,
	_tradeItems: [],
	init: function() {
		this.requires('Actor, Twoway, Collision, Delay, Persist, Solid, Color, Gravity, BoxOverlays');
			this.addArms();
			this.color('black')
			.gravity('Floor')
			.gravityConst(0.6)
			.twoway(this._moveSpeed, this._jumpSpeed)
			.bind('EnterFrame', function(data) {
				this.checkDead();
			})
			this.bind('KeyDown', function(e) {
				switch (e.key) {
					case Crafty.keys.DOWN_ARROW:
						Game.playerKeys.DOWN_ARROW = true;
						this.y += this.h/2;
						this.h = this.h/2;
						break;
					case Crafty.keys.RIGHT_ARROW:
						Game.playerKeys.RIGHT_ARROW = true;
						break;
					case Crafty.keys.E:
						Game.playerKeys.E = true;
						this.changeMode();
						break;
					case Crafty.keys.R:
						Game.playerKeys.R = true;
						break;
					case Crafty.keys.SPACE:
						Game.playerKeys.SPACE = true;
						this.itemRouter();
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
					case Crafty.keys.DOWN_ARROW:
						Game.playerKeys.DOWN_ARROW = true;
						this.h = this.h * 2;
						this.y -= this.h/2;
						break;
					case Crafty.keys.UP_ARROW:
						Game.playerKeys.UP_ARROW = false;
						break;
					case Crafty.keys.RIGHT_ARROW:
						Game.playerKeys.RIGHT_ARROW = false;
						break;
					case Crafty.keys.E:
						Game.playerKeys.E = false;
						break;
					case Crafty.keys.R:
						Game.playerKeys.R = false;
						break;
					case Crafty.keys.SPACE:
						Game.playerKeys.SPACE = false;
						break;
				}
			})
			.onHit('Actor', function(data) {
				var hitObject = data[0].obj;
				var hitObjectType;
				if (hitObject.has('Void')) {
					hitObjectType = 'Void';
				} else if (hitObject.has('Floor')) {
					hitObjectType = 'Floor';
				} else if (hitObject.has('InterActive')) {
					hitObjectType = 'InterActive';
				}
				console.log(data)
				this.collisionHandler(hitObjectType, hitObject);
			})
			.bind('Moved', function(data) {
				this._previousLocation = data;
				this._currentLocation = {x:this.x, y:this.y};
				this._nextLocation = {x:this.x + this._movement.x, y:this.y + this._movement.y};
				this._adjacent = this.checkAdjacent();
			})
			.bind('NewDirection', function(data) {
				if (data.y === -this._moveSpeed || data === 'UP') {
					this._direction = 'UP';
				} else if (data.y === this._moveSpeed || data === 'DOWN') {
					this._direction = 'DOWN';
				} /*else if (data.x === this._moveSpeed || data === 'RIGHT') {
					this._direction = 'RIGHT';
				} else if (data.x === -this._moveSpeed || data === 'LEFT') {
					this._direction = 'LEFT';
				}*/
			});
	},

	addArms: function () {
		this._armLocation = {x: this.x + 12, y: this.y + 26};
		this._armLeft = Crafty.e('Arm');
		this._armLeft._armSide = 'LEFT';
		this._armLeft.z = this.z - 1;
		this._armLeft._armMode = 'remove';
		this._armLeft.color('red');

		this._armRight = Crafty.e('Arm');
		this._armRight._armSide = 'RIGHT';
		this._armRight._armMode = 'add';
		this._armRight.color('orange');
	},

    changeMode: function() {
        var currentMode = this._modes.indexOf(this._activeMode);
        var nextMode = currentMode + 1;
        if (nextMode < this._modes.length) {
            this._activeMode = this._modes[nextMode];
        } else {
            this._activeMode = this._modes[0];
        }
        console.log(this._activeMode)
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
			console.log('test')
				this._speed = 0;
				if (this._movement) {
				  this.x -= this._movement.x;
				}
				if (this._movement.y !== (this._moveSpeed * -1)) {
				  this.y -= this._movement.y;
				}
			break;
			case 'InterActive':
				if (Game.playerKeys.E && !this._addingGold) {
					this._addingGold = true;
					this.turnGold(hitObject);
				}
				if (Game.playerKeys.R && !this._removingGold) {
					this._removingGold = true;
					this.removeGold(hitObject);
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
		var squareUp, squareDown, squareRight, squareLeft;
		if (Game.currentMap.occupiedSquares[currentSquare.y - 1][currentSquare.x]) {
			squareUp = Game.currentMap.occupiedSquares[currentSquare.y - 1][currentSquare.x].type;
		} else {
			squareUp = 'empty';
		}

		if (Game.currentMap.occupiedSquares[currentSquare.y + (this.h/Game.map_grid.tile.height)][currentSquare.x]) {
			squareDown = Game.currentMap.occupiedSquares[currentSquare.y + (this.h/Game.map_grid.tile.height)][currentSquare.x];
		} else {
			squareDown = 'empty';
		}

		if (Game.currentMap.occupiedSquares[currentSquare.y][currentSquare.x + 1]) {
			squareRight = Game.currentMap.occupiedSquares[currentSquare.y + 1][currentSquare.x];
		} else {
			squareRight = 'empty';
		}

		if (Game.currentMap.occupiedSquares[currentSquare.y][currentSquare.x - 1]) {
			squareLeft = Game.currentMap.occupiedSquares[currentSquare.y + 1][currentSquare.x];
		} else {
			squareLeft = 'empty';
		}
		return {up:squareUp, down:squareDown, right:squareRight, left:squareLeft};
	},

	turnGold: function (hitObject) {
		if (Game.playerKeys.E) {
			this.delay(function(){
					if (hitObject._currentGold === hitObject._targetGold) {
						hitObject.color('yellow');
						hitObject._currentGold++;
					} else if (hitObject._currentGold <= hitObject._maxGold) {
						if (hitObject._currentGold === hitObject._maxGold) {
							hitObject.destroy();
						} else {
							hitObject._currentGold++;
						}
					}
				this._addingGold = false;
			}, 400);
		}
	},

	removeGold: function (hitObject) {
		this.delay(function(){
			if (hitObject._currentGold > 0) {
				hitObject._currentGold--;
			}
			this._removingGold = false;
		}, 1000);
	}
});

Crafty.c('Arm', {
	_armMode: null,
	_armSide: null,
	_frontArm: false,
	init: function() {
		var player = Crafty('Player');
		this.requires('2D, Canvas, Color, MouseFace, Touch'); //, BoxOverlays
		this.origin(5, 5);
		this.attr({
			move: {left: false, right: false, up: false, down: false},
			x: player._armLocation.x, y: player._armLocation.y, z: 2 + 1,
			moving: false,
			curAngle: 0,
		});
		player.attach(this);
		this.h = 1;
		this.w = 10;
		this.bind('EnterFrame', function() {
			if (this._parent._direction == this._armSide) {
				this._frontArm = true;
				this.z = this._parent.z + 1;
			} else {
				this._frontArm = false;
				this.z = this._parent.z - 1;
			}
		});
		this.bind('MouseMoved', function(e) {
			if (this._parent._activeMode === this._armMode) {
				this.curAngle = (e.grad) + 90;
				if (e.pos.x < this.x) {
					this._parent._direction = 'LEFT';
				} else if (e.pos.x > this.x) {
					this._parent._direction = 'RIGHT';
				}
				this.rotation = this.curAngle + 180;
			} else {
				this.rotation = 0;
			}
		});
	}
});