Crafty.c('JSBase', {
	_stick:null,
	_poly:null,
    _center: {},
<<<<<<< HEAD
	init: function () {
		this.requires('2D, DOM, Color');
		this.x = 0;
		this.y = 0;
=======
    _colors: ['red','blue','white','orange','yellow','green','purple','tan','brown'],
    _uL:null,
    _u:null,
    _uR:null,
    _bL:null,
    _b:null,
    _bR:null,
    _l:null,
    _r:null,
	init: function () {
		this.requires('2D, DOM, Color');
		this.x = 50;
		this.y = 300;
>>>>>>> working joystick
		this.h = 198;
		this.w = 198;
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
            stick._xLimit = this.x + this.w
            stick._yLimit = this.y + this.h
		}
		this._center.x = this.x + (this._w/2);
		this._center.y = this.y + (this._h/2);
		this.createZones()
	},

	createZones: function() {
    this._uL = new Crafty.polygon([0,0],[(this.w/3), 0],[(this.w/3), (this.h/3)],[0,(this.h/3)]);
    console.log(this._uL);
    this._u = new Crafty.polygon([],[],[],[]);
    this._uR = new Crafty.polygon([],[],[],[]);
    this._bL = new Crafty.polygon([],[],[],[]);
    this._b = new Crafty.polygon([],[],[],[]);
    this._bR = new Crafty.polygon([],[],[],[]);
    this._l = new Crafty.polygon([],[],[],[]);
    this._r = new Crafty.polygon([],[],[],[]);
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
            var centerX = this._center.x = this.x + (this.w/2);
            var centerY = this._center.y = this.y + (this.h/2);
			var parent = this._parent;
            if (Crafty.math.distance(centerX, centerY, parent._center.x, parent._center.y) >= this._maxDistance) {
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
        return;
	},


});