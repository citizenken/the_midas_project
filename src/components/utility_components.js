// Camel is just an Actor with a certain color
Crafty.c('TargetMovement', {
	init: function() {
		this.requires('Fourway, Delay')
			this.oldLocation;
			this._movement = {x:null, y:null};
			this._movementOld = {}
			this.bind('EnterFrame',	function() {
				if (this.targetLocation.x == null) {
					this.targetLocation = this.createRandomTarget()
				}

				var target = this.targetLocation
				var distanceToTarget = Crafty.math.distance(this.x, this.y, target.x, target.y);
				if (distanceToTarget == 0 || distanceToTarget == 1 || this._maxSteps == 0) {
					this.changeDirection();
				} else {
					this.trigger('Moved');
				}

			})
			.bind('Moved', function(data) {
				this.move();
			})
/*				.bind('KeyDown', function(e) {
				switch (e.key)
				{
					case Crafty.keys['L']:
						this.move();
						break;
				}
			})*/
	},

	move: function() {
/*			if (this.targetLocation.x == null) {
			this.targetLocation = this.createRandomTarget()
		}

		var target = this.targetLocation
		var distanceToTarget = Crafty.math.distance(this.x, this.y, target.x, target.y);
		if (distanceToTarget == 0 || distanceToTarget == 1 || this.attr.maxSteps == 0) {
			this.changeDirection();*/
		// } else {
			var target = this.targetLocation
			this.oldLocation = {x:this.x, y:this.y};

			this.diffx = this.x - target.x;
			this.diffy = this.y - target.y;

			this._angle = Math.atan(this.diffy / this.diffx);
			var dirmodx;
			var dirmody;
			//positive means this is to the right of target
			if (this.diffx > 0) {
				dirmodx = -1;
			} else {
				dirmodx = 1;
			}
			if (this.diffy > 0) {
				dirmody = -1;
			} else {
				dirmody = 1;
			}

			this.x += Math.round((Math.cos(this._angle) * this._speed) * dirmodx);
			this.y += Math.round((Math.sin(this._angle) * this._speed) * dirmody);

			this._movement.x = this.x - this.oldLocation.x;
			this._movement.y = this.y - this.oldLocation.y;
			this._maxSteps -= 1;

			this.trigger('NewDirection', this._movement);
		// }

	},

    _round8: function(d)
    {
            return Math.round(d * 100000000.0) / 100000000.0;
    }

});

// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
	_paused: false,
init: function() {
	this.requires('Mouse')
	this.bind('KeyDown', function(e) {
		if (!Game.keyPressed) {
			Game.keyPressed = true;
			if (e.key === Crafty.keys.ESC) {
				Crafty.pause();
				console.log(Crafty.isPaused());
			}
		}
	});
	this.bind('KeyUp', function(e) {
		/*if (e.key == Crafty.keys['ESC']) {
			Crafty.pause(true);
			this._paused = true;
			console.log(Crafty.isPaused())
		} else if (e.key == Crafty.keys['ESC']) {
			Crafty.pause(false);
			this._paused = false;
			console.log(Crafty.isPaused())
		}*/
	});

	// console.log(Crafty.isPaused());
	this.bind('Pause', function(e) {
		if (Crafty('PauseBackground').length === 0) {
			Crafty.e('PauseBackground');
		}
	});
	this.bind('Unpause', function() {
		if (Crafty('PauseBackground').length === 1) {
			Crafty('PauseBackground').destroy();
		}
	});
	this.attr({
		w: Game.map_grid.tile.width,
		h: Game.map_grid.tile.height
	});
},

// Locate this entity at the given position on the grid
at: function(x, y) {
if (x === undefined && y === undefined) {
  return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height};
} else {
  this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height});
  return this;
}
}
});

Crafty.c('PauseBackground', {
	init: function() {
		this.requires('2D, DOM, Grid, Color');
		this.attr({x: 0, y: 0, w:Game.width(), h:Game.height()})
		.color('rgba(0,0,0,0.3)');
	},
});

Crafty.c('PauseMenu', {
	init: function() {
		this.requires('2D, DOM, Color');
		this.attr;
		this.color('black');
	},
});

Crafty.c('TextBox', {
	init: function() {
		this.requires('2D, DOM, Color');
		this.attr({w:300, h:200});
		this.color('white');
		this.getLocation();
	},

	getLocation: function() {
		var dirmodx;
		var dirmody;
		var viewportX = Crafty.viewport.x;
		var viewportY = Crafty.viewport.y;
		if (Crafty.viewport.x < -1) {
			dirmodx = -1;
		} else if (Crafty.viewport.x === 0) {
			dirmodx = 0;
		} else {
			dirmodx = 1;
		}

		if (Crafty.viewport.y < -1) {
			dirmody = -1;
		} else if (Crafty.viewport.y === 0) {
			dirmody = 0;
		} else {
			dirmody = 1;
		}
		console.log(Crafty.viewport.y, Crafty.viewport.y + (Crafty.viewport.height*dirmody));
		this.attr({x:viewportX + (50*dirmodx), y:viewportY + (50*dirmody)});
		console.log(this.x, this.y);
	}
});

Crafty.c('Void', {
	init: function() {
		this.requires('Actor');
	}
});

Crafty.c('MouseLayer', {
	init: function() {
		this.requires('2D, Mouse, Canvas');
		this.attr({w:Game.width(), h:Game.height()});
		this.bind('Click', function(e) {
			// if (e.buttons == 1) {
				Game.mouse.down = true;
				Game.mouse.mouseLocation = {x:e.clientX, y:e.clientY};
			// }
		});
		this.bind('MouseUp', function(e) {
			Game.mouse.down = false;
			Game.player._arm.rotation = 0;
		});
	}
});

Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
		this.bind('Click', function () {
			console.log(this);
		});
	},
		checkDead: function() {
			if (this._hitPoints === 0) {
				this.destroy();
			}
			return false;
		}
});

Crafty.c('EmptySpace', {
	init: function () {
		this.requires('Actor');
	}
});

Crafty.c('BoxOverlays', {
    /* Parts of this component are inspired by Witali Mik's (BlackScorp)
* HitBox component: https://github.com/BlackScorp/crafty_hitbox */

    init: function(){
        if (Crafty.support.canvas){
            // Public API
            this.boxOverlays = {};

            // bo is for internal use
            var bo = this.boxOverlays;
            bo.drawMBR = false;
            bo.drawRot = true;
            bo.fontSize = 9;
            bo.boxColor = "#5AF";
            bo.mbrBoxColor = "#FF0";
            bo.rotBoxColor = "#0F0";
            bo.markTopLeft = true;

            function formatCoords(x, y, w, h) {
                var string = "x:"+Math.round(x)+", y:"+Math.round(y);

                if (typeof(w) != "undefined" && typeof(h) != "undefined") {
                    string += ", w:"+Math.round(w)+", h:"+Math.round(h);
                }

                return string;
            }

            // get or create canvas element
            var c = document.getElementById('BoxOverlaysCanvas');

            if (!c) {
                c = document.createElement("canvas");
                c.id = 'BoxOverlaysCanvas';
                c.width = Crafty.viewport.width;
                c.height = Crafty.viewport.height;
                c.style.position = 'absolute';
                c.style.left = "0px";
                c.style.top = "0px";
                c.style.zIndex = Crafty.stage.elem.style.zIndex + 1;
                Crafty.stage.elem.appendChild(c);
            }

            var ctx = c.getContext('2d');

            this.bind("EnterFrame", function(){
                ctx.clearRect(0, 0, Crafty.viewport.width, Crafty.viewport.height);

                ctx.font = "bold " + bo.fontSize + "px monospace";

                // box with default entity coordinates
                ctx.strokeStyle = bo.boxColor;
                ctx.fillStyle = bo.boxColor;
                ctx.strokeRect(this._x, this._y, this._w, this._h);

                if (bo.markTopLeft) ctx.fillRect(this._x-2, this._y-2, 5, 5);

                var mbr = this.mbr();

                ctx.fillText("Ent: " + formatCoords(this._x, this._y, this._w, this._h), mbr._x + mbr._w + 5, mbr._y + bo.fontSize);

                // box with rotation applied
                if (bo.drawRot) {
                    var rad = this.rotation * (Math.PI / 180);
                    var cosRad = Math.cos(rad);
                    var sinRad = Math.sin(rad);
                    var x = this.x + this._origin.x + cosRad * (-this._origin.x) - sinRad * (-this._origin.y);
                    var y = this.y + this._origin.y + sinRad * (-this._origin.x) + cosRad * (-this._origin.y);

                    ctx.fillStyle = bo.rotBoxColor;
                    ctx.strokeStyle = bo.rotBoxColor;
                    ctx.fillText("Rot: " + formatCoords(x, y), mbr._x + mbr._w + 5, mbr._y + bo.fontSize * 2 + 3);

                    if (bo.markTopLeft) ctx.fillRect(x-2, y-2, 5, 5);

                    /* draw only if it doesn't overlap with entity box,
i.e. if the entity is rotated */
                    if (typeof(this.rotation) != "undefined" && (this.rotation % 360 != 0)) {
                        ctx.save();
                        ctx.strokeStyle = bo.rotBoxColor;
                        ctx.translate(this.x + this._origin.x, this.y + this._origin.y);
                        ctx.rotate(rad);
                        ctx.strokeRect(-this._origin.x, -this._origin.y, this.w, this.h);
                        ctx.restore();
                    }
                }

                // minimum bounding rectangle of the (rotated) entity
                if (bo.drawMBR) {
                    ctx.fillStyle = bo.mbrBoxColor;
                    ctx.strokeStyle = bo.mbrBoxColor;
                    ctx.fillText("MBR: " + formatCoords(mbr._x, mbr._y, mbr._w, mbr._h), mbr._x + mbr._w + 5, mbr._y + bo.fontSize * 3 + 6);

                    if (bo.markTopLeft) ctx.fillRect(mbr._x-2, mbr._y-2, 5, 5);

                    /* draw only if it doesn't overlap with entity box,
i.e. if the entity is rotated */
                    if (mbr._x != this._x || mbr._y != this._y || mbr._w != this._w || mbr._h != this._h) {
                        ctx.strokeRect(mbr._x, mbr._y, mbr._w, mbr._h);
                    }
                }

            });
        }

        return this;
    }
});

Crafty.c("DiagonalLine", {
    init: function () {
        this.requires("2D, Canvas");
        this.bind("Draw", this._draw_me);
        this.ready = true;
    },
    _draw_me: function (e) {
        var ctx = e.ctx;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "green";
        ctx.beginPath();
        ctx.moveTo(e.pos._x, e.pos._y);
        ctx.lineTo(e.pos._x + 5, e.pos._y + 7);
        ctx.stroke();
    }
});