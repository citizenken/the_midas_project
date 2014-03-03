
Crafty.c('Arm', {
	_armMode: null,
	_armSide: null,
	_frontArm: false,
	init: function() {
		Crafty('Player').attach(this);
		var player = this._parent;
		this.requires('2D, Canvas, Color, Collision'); //, BoxOverlays MouseFace
		this.origin(2, 2);
		this.attr({
			move: {left: false, right: false, up: false, down: false},
			x: player._armLocation.x, y: player._armLocation.y, z: 2 + 1,
			moving: false,
			curAngle: 0,
		});
		this.h = 25;
		this.w = 5;
		this.bind('EnterFrame', function() {
			if (player._direction == this._armSide) {
				this._frontArm = true;
				this.z = player.z + 1;
			} else {
				this._frontArm = false;
				this.z = player.z - 1;
			}
			if (player._activeMode == this._armMode && !this._visible) {
				this._visible = true;
			} else if (player._activeMode !== this._armMode && this._visible) {
				this._visible = false;
			}
/*			if (player._flipped) {
				this.x = player._armLocation.x;
				this.y = player._armLocation.y;
			}*/
		});
		this.bind('MouseDown', function(e) {
			Game.mouseButton = true;
			if (this._visible === false) {
				this._visible = true;
			}
		});
		this.bind('MouseUp', function() {
			Game.mouseButton = false;
			// this.rotation = 0;
			if (this._visible) {
				this._visible = false;
			}
		});
		this.bind('MouseMoved', function(e) {
			this.rotateArm(player, e);
		});
		this.onHit('Actor', function(data) {
			var hitObject = data[0].obj;
			var hitObjectType;
			if (hitObject.has('InterActive')) {
				hitObjectType = 'InterActive';
				player.collisionHandler(hitObjectType, hitObject);
			}
		})
	},

	rotateArm: function(player, e) {
		if (player._activeMode === this._armMode) {
			this.curAngle = (e.grad) + 90;
			if (e.pos.x < this.x) {
				player._direction = 'LEFT';
			} else if (e.pos.x > this.x) {
				player._direction = 'RIGHT';
			}
			player.trigger('NewDirection', player._movement);
			this.rotation = this.curAngle + 180;
		} else if (!Game.mouseButton) {
			this.rotation = 0;
			this._visible = false;
		}
	}
});