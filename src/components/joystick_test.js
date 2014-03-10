Crafty.c('JSBase', {
	_stick:null,
    _center: {},
    _uL:null,
    _u:null,
    _uR:null,
    _bL:null,
    _b:null,
    _bR:null,
    _L:null,
    _R:null,
	init: function () {
		this.requires('2D, DOM, Color');
		this.x = 50;
		this.y = 300;
		this.h = 99;
		this.w = 99;
		this._center.x = this.x + (this._w/2);
		this._center.y = this.y + (this._h/2);
		this.color('red');
		if (!this._stick) {
			var stick = this._stick = Crafty.e('Joystick')
			stick.x = this.x + (this.w/3);
			stick.y = this.y + (this.h/3);
            stick.h = (this.h/3);
            stick.w = (this.w/3);
			stick._home = {x:stick.x, y:stick.y};
			stick._parent = this;
			stick._maxDistance = (this.w/2);
            stick._xLimit = this.x + this.w;
            stick._yLimit = this.y + this.h;
		}
		this._center.x = this.x + (this._w/2);
		this._center.y = this.y + (this._h/2);
		this.createZones()
	},

	createZones: function() {
		this._uL = Crafty.e('JSZone');
        this._uL.x = this.x;
        this._uL.y = this.y;

        this._u = Crafty.e('JSZone');
        this._u.x = this.x + (this.w/3);
        this._u.y = this.y;

   		this._uR = Crafty.e('JSZone');
        this._uR.x = this.x + (this.w/3 * 2);
        this._uR.y = this.y;

		this._L = Crafty.e('JSZone');
        this._L.x = this.x;
        this._L.y = this.y + (this.h/3);

		this._R = Crafty.e('JSZone');
        this._R.x = this.x + (this.w/3 * 2);
        this._R.y = this.y + (this.h/3);

		this._bL = Crafty.e('JSZone');
        this._bL.x = this.x;
        this._bL.y = this.y + (this.h/3 * 2);

        this._b = Crafty.e('JSZone');
        this._b.x = this.x + (this.w/3);
        this._b.y = this.y + (this.w/3 * 2);

		this._bR = Crafty.e('JSZone');
        this._bR.x = this.x + (this.w/3 * 2);
        this._bR.y = this.y + (this.h/3 * 2);
	}
});

Crafty.c('Joystick', {
	_center:{},
	_movingUp:false,
	_movingDown:false,
	_movingLeft:false,
	_movingRight:false,
	init: function () {
		this.requires('2D, DOM, Draggable, Color');
		this.color('black');
		this.h = 50;
		this.w = 50;
		this.bind('Dragging', function(e) {
			//console.log('on ent', e);
            var centerX = this._center.x = this.x + (this.w/2);
            var centerY = this._center.y = this.y + (this.h/2);
			var parent = this._parent;

			// console.log(this._parent._uL.isAt(centerX,centerY));
			// console.log(this._parent._uL.containsPoint(centerX, centerY));

            if (Crafty.math.distance(centerX, centerY, parent._center.x, parent._center.y) >= this._maxDistance) {
				this.adjustPosition();
			}

			// this.movePlayer();

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
        return;
	}


});

Crafty.c('JSZone', {
	init: function() {
		this.requires('2D, DOM, Color');
		this.h = (Crafty('JSBase').h/3);
        this.w = (Crafty('JSBase').w/3);
	}
})