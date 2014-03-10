Crafty.c('JoystickBase', {
	_stick: null,
	_x: null,
	_y: null,
	init: function () {
		this.requires('2D, DOM, Color, Touch, BoxOverlays')
		this.h = 100;
		this.w = 100;
		this.bind('TouchStart1', function(e){
			console.log(e)
			this.x = e.clientX - (this.w/2);
			this.y = e.clientY - (this.h/2);
		})
		this.bind('TouchEnd1', function(e){
			this.x = null;
			this.y = null;
		})
		this.areaMap(
			[this._x, this._y], //top left
			[this._w, this._y], //top right
			[this._x, this._h], //bottom left
			[this._w, this._h] //bottom right
			);
		this.origin((this.w/2), (this.h/2));
		this.color('black');
		if (!this._stick) {
			this._stick = Crafty.e('Joystick');
			this._stick.x = this.x + (this.w/2);
			this._stick.y = this.y + (this.h/2);
		}
	}
})

Crafty.c('Joystick', {
	init: function () {
		this.requires('2D, DOM, Color, Touch, BoxOverlays');
		this.color('red');
		this.h = 50;
		this.w = 50;
		this.z = 5;
		this.bind('EnterFrame', function() {
			if (Game.joystick) {
				Game.joystick = true;
				this._visible = true;
			} else {
				Game.joystick = false;
				this._visible = false;
			}
		})
		this.bind('MouseDown', function(e) {
			console.log(e);
			var x = e.clientX;
			var y = e.clientY;
			console.log(this.isAt(x, y))
			if (x > this.x && x < (this.x + this.w) && y > this.y && y < (this.y + this.h)) {
				console.log('in joystick box');
			}
		})
		this.bind('MouseUp', function() {
			this._visible = false;
		})
		this.bind('MouseMove', function(e) {
			// console.log(e)
			if (!Game.joystick){

			// if (player._activeMode === this._armMode) {
				this.curAngle = (e.grad) + 90;
				// if (e.pos.x < this.x) {
				// 	player._direction = 'LEFT';
				// } else if (e.pos.x > this.x) {
				// 	player._direction = 'RIGHT';
				// }
				// player.trigger('NewDirection', player._movement);
				this.rotation = this.curAngle + 180;
			}
			// } else if (!Game.mouseButton) {
			// 	this.rotation = 0;
			// 	this._visible = false;
			// }
		})

	}
})