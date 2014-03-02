Crafty.c('JoystickBase', {
	init: function () {
		this.requires('2D, DOM, Color, Mouse, BoxOverlays')
		this.attr({x:0, y: (Crafty.canvas._canvas.height - 100), w:100, h:100, z:50})
		this.origin((this.w/2), (this.h/2));
		this.color('black');
		this.bind('EnterFrame', function() {
			if (Game.joystick) {
				Game.joystick = true;
				this._visible = true;
			} else {
				Game.joystick = false;
				this._visible = false;
			}
		})
		this.bind('Click', function(e) {
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