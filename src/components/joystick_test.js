Crafty.c('JSBase', {
	_stick:null,
	_poly:null,
	init: function () {
		this.requires('2D, DOM, Color');
		this.x = 0;
		this.y = Crafty.viewport.h - this.h;
		this.h = 198;
		this.w = 198;
		this.color('red');
		if (!this._stick) {
			this._stick = Crafty.e('Joystick');
			this._stick.x = (this.w/3);
			this._stick.y = (this.h/3);
			this._stick._home = {x:this._stick.x, y:this._stick.y};
			this._stick._parent = this;
		}
	}
});

Crafty.c('Joystick', {
	_center:{},
	init: function () {
		this.requires('2D, DOM, Draggable, Color');
		this.color('black');
		this.h = 50;
		this.w = 50;
		this._center.x = (this.w/2);
		this._center.y = (this.h/2);
		this._corners = [this.x, this.y, this.x + this.w, this.y + this.h];
		this.bind('Dragging', function(e) {
			//console.log(this._parent,this)
			if (!this._parent.contains(this)) {
				this.checkSide(e);
			}
		});
		this.bind('StopDrag', function() {
			this.x = this._home.x;
			this.y = this._home.y;
		});
	},

	checkSide: function(e) {
		var corner = this._corners;
		if (e.clientX > (this._parent.x + this._parent.w)) {
			this.x = (this._parent.w - this.w)
		}
	}
});