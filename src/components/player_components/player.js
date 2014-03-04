Crafty.c('Player', {
	_activeItem: 'Sword',
	_activeMode: 'add',
	_addingGold: false,
	_armLocation: null,
	_armsVisible: false,
	_arm: null,
	_removingGold: false,
	_adjacent: null,
	_currentLocation: null,
	_currentZone: {x:null, y:null},
	_direction: 'RIGHT',
	_flipped: false,
	_hitPoints: 30,
	_goldLevel: 5,
	_items: [],
	_jumpSpeed: 8,
	_justTriggeredScene: false,
	_modes: ['add', 'remove'],
	_money: 000000000000,
	_moveSpeed: 4,
	_nextLocation: null,
	_playerHUD: null,
	_previousLocation: null,
	_spriteDirction: 'RIGHT',
	_water: 30,
	_tradeItems: [],
	init: function() {
		this.requires('Actor, Twoway, Collision, Delay, Persist, Solid, Gravity, SpriteAnimation, spr_human');
			this.h = Game.map_grid.tile.height * 2;
			this.w = Game.map_grid.tile.width * 2;
			this.addArms();
			this.gravity('Floor');
			this.gravityConst(0.6);
			this.reel('WalkForeward', 400, 0, 1, 7);
			this.reel('WalkBackward', 400, 0, 1, 7);
			this.reel('Kneel', 400, 0, 6, 2);
			this.twoway(this._moveSpeed, this._jumpSpeed);
			this.bind('EnterFrame', function(data) {
				this.checkDead();
				if (this._armLeft._visible === false  && this._armRight._visible === false) {
					this._armsVisible = false;
				} else {
					this._armsVisible = true;
				}
			});
			this.bind('KeyDown', function(e) {
				console.log(e);
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
						// this.changeItem();
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
/*				if (hitObject.has('Void')) {
					hitObjectType = 'Void';
				} else */
				if (hitObject.has('Floor')) {
					hitObjectType = 'Floor';
				}
				this.collisionHandler(hitObjectType, hitObject);
			})
			.bind('Moved', function(data) {
				this._previousLocation = data;
				this._currentLocation = {x:this.x, y:this.y};
				this._nextLocation = {x:this.x + this._movement.x, y:this.y + this._movement.y};
				// this._adjacent = this.checkAdjacent();
			})
			.bind('NewDirection', function(data) {
				this.directionHandler(data);
			});
	},

	addArms: function () {
		if (this._flipped) {
			this._armLocation = {x: this.x + 46, y: this.y + 18};
		} else if (!this._flipped) {
			this._armLocation = {x: this.x + 28, y: this.y + 18};
		}
		this._armLeft = Crafty.e('Arm');
		this._armLeft._armSide = 'LEFT';
		this._armLeft.z = this.z - 1;
		this._armLeft._armMode = 'remove';
		this._armLeft.color('red');
		this._armLeft._visible = false;

		this._armRight = Crafty.e('Arm');
		this._armRight._armSide = 'RIGHT';
		this._armRight._armMode = 'add';
		this._armRight.color('orange');
		this._armRight._visible = false;
	},

    changeMode: function() {
        var currentMode = this._modes.indexOf(this._activeMode);
        var nextMode = currentMode + 1;
        if (nextMode < this._modes.length) {
            this._activeMode = this._modes[nextMode];
        } else {
            this._activeMode = this._modes[0];
        }
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
			case 'InterActive':
				if (Game.mouseButton && !this._addingGold && this._activeMode === 'add') {
					this._addingGold = true;
					this.turnGold(hitObject);
				} else if (Game.mouseButton && !this._removingGold && this._activeMode === 'remove') {
					this._removingGold = true;
					this.removeGold(hitObject);
				}
			break;
			case 'TradeItem':
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

	directionHandler: function (data) {
		if (data.y === -this._moveSpeed) {
			this._direction = 'UP';
		} else if (data.y === this._moveSpeed) {
			this._direction = 'DOWN';
			if (!this.isPlaying('Kneel')) {
				this.animate('Kneel', -1);
			}
		} else if (data.x === this._moveSpeed && !this._armsVisible) {
			this._direction = 'RIGHT';
			this.flipAnimation();
			this.facingRight();
		}  else if (data.x === this._moveSpeed) {
			this.flipAnimation();
			this.facingRight();
		} else if (data.x === -this._moveSpeed && !this._armsVisible) {
			this._direction = 'LEFT';
			this.flipAnimation();
			this.facingLeft();
		} else if (data.x === -this._moveSpeed) {
			this.flipAnimation();
			this.facingLeft();
		} else if (data.x === 0 && data.y === 0) {
			this.pauseAnimation();
			this.flipAnimation();
		}
	},

	facingLeft: function () {
		if (this._direction === 'RIGHT' && !this.isPlaying('WalkBackward')) {
			this.animate('WalkBackward', -1);
		} else if (this._direction === 'LEFT' && !this.isPlaying('WalkForeward')) {
			this.animate('WalkForeward', -1);
		}
	},

	facingRight: function () {
		if (this._direction === 'RIGHT' && !this.isPlaying('WalkForeward')) {
			this.animate('WalkForeward', -1);
		} else if (this._direction === 'LEFT' && !this.isPlaying('WalkBackward')) {
			this.animate('WalkBackward', -1);
		}
	},

	flipAnimation: function () {
		if (this._direction !== this._spriteDirction && !this._flipped) {
			this.flip('X');
			this._spriteDirction = this._direction;
			this._flipped = true;
			this._armRight.x = this.x + 35;
			this._armLeft.x = this.x + 35;
		} else if (this._direction !== this._spriteDirction && this._flipped) {
			this.unflip('X');
			this._spriteDirction = this._direction;
			this._flipped = false;
			this._armRight.x = this.x + 28;
			this._armLeft.x = this.x + 28;
		}

		return;
	},

	turnGold: function (hitObject) {
		if (Game.mouseButton) {
			this.delay(function(){
					if (hitObject._currentGold === hitObject._targetGold) {
						hitObject._oldColor = hitObject._color;
						hitObject.color('yellow');
						hitObject._currentGold++;
					} else if (hitObject._currentGold <= hitObject._targetGold) {
						hitObject._currentGold++;
						console.log(hitObject._currentGold);
					}
				this._addingGold = false;
			}, 400);
		}
	},

	removeGold: function (hitObject) {
		this.delay(function(){
			if (hitObject._currentGold > 0) {
				hitObject._currentGold--;
				console.log(hitObject._currentGold);
			} else if (hitObject._currentGold === 0 && hitObject._color === 'yellow') {
				hitObject.color(hitObject._oldColor)
			}
			this._removingGold = false;
		}, 400);
	}
});