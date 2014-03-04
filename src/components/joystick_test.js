Crafty.c('JSBase', {
	_stick:null,
	_poly:null,
    _center: {},
	init: function () {
		this.requires('2D, DOM, Color');
		this.x = 0;
		this.y = 0;
		this.h = 198;
		this.w = 198;
		this.color('red');
		if (!this._stick) {
			var stick = this._stick = Crafty.e('Joystick')
			stick.x = (this.w/3);
			stick.y = (this.h/3);
            stick.h = (this.h/3);
            stick.w = (this.w/3);
			stick._home = {x:stick.x, y:stick.y};
			stick._parent = this;
			stick._maxDistance = (this.w/2);
            stick._xLimit = this.x + this.w
            stick._yLimit = this.y + this.h
		}
		this._center.x = this.x + (this._w/2);
		this._center.y = this.y + (this._h/2);
	}
});

Crafty.c('Joystick', {
	_center:{},
	init: function () {
		this.requires('2D, DOM, Draggable, Color');
		this.color('black');
		this.h = 50;
		this.w = 50;
		this.bind('Dragging', function(e) {
            var centerX = this._center.x = this.x + (this.w/2);
            var centerY = this._center.y = this.y + (this.h/2);
			var parent = this._parent;
            if (Crafty.math.distance(centerX, centerY, parent._center.x, parent._center.x) >= this._maxDistance) {
				this.adjustPosition();
			}
		});
		this.bind('StopDrag', function() {
			this.x = this._home.x;
			this.y = this._home.y;
		});
	},

	adjustPosition: function() {
        if (this._center.x >= this._xLimit) {
            this.x = this._xLimit - (this.w/2);
        } else if (this._center.x <= this._parent.x) {
            this.x = this._parent.x - (this.w/2);
        }

        if (this._center.y >= this._yLimit) {
            this.y = this._yLimit - (this.h/2);
        } else if (this._center.y <= this._parent.y) {
            this.y = this._parent.y - (this.h/2);
        }
	}
});