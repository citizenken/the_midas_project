// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Scenery', {
	init: function() {
	this.requires('Actor, Solid, Collision')
	},
	});

// A Tree is just an Actor with a certain color
Crafty.c('Tree', {
	init: function() {
	this.requires('Scenery, Color')
	  .color('rgb(20, 125, 40)');
	},
});

Crafty.c('Gate', {
	init: function() {
	this.requires('Scenery, Color')
	  .color('black');
	},
});

Crafty.c('Floor', {
	_maxGold: 15,
	_targetGold: 10,
	_currentGold: 0,
	init: function() {
	this.requires('Actor, Solid, Collision, Color')
	  .color('blue');
	},
});

Crafty.c('Button', {
	_targetGold: 10,
	_currentGold: 0,
	init: function() {
	this.requires('Scenery, Color, InterActive')
	  .color('red');
	  this.h = 10;
	  this.w = 10;
	},
});

Crafty.c('Well', {
	init: function() {
	this.requires('Scenery, spr_uncovered_well_32');
	},
});

Crafty.c('Mountain', {
	init: function() {
	this.requires('Scenery, Color')
		.color('brown');
	},
});

Crafty.c('Mountain', {
	init: function() {
	this.requires('Scenery, Color, Touch')
		.color('brown');
		this.h = 100;
		this.w = 100;
		this.bind('Touch1', function(e) {
			this.color('green');
		});
		this.bind('Release1', function(e) {
			this.color('brown');
		});
	},
});


Crafty.c('Mountain2', {
	init: function() {
	this.requires('Scenery, Color, Touch')
		.color('brown');
		this.x = 250
		this.y = 250
		this.h = 100;
		this.w = 100;
		this.bind('Swipe1', function(e) {
			console.log(e)
			if (this._color === 'yellow') {
				this.color('brown');
			} else {
				this.color('yellow');
			}
		});
/*		this.bind('Release1', function(e) {
			this.color('brown');
		});*/
	},
});



// A Bush is just an Actor with a certain color
Crafty.c('Bush', {
	init: function() {
	this.requires('Scenery, Color')
	  .color('rgb(20, 185, 40)');
	},
});

Crafty.c('SandDune', {
	init: function() {
	this.requires('Actor, Color')
	  .color('white');
	  this._z = -1;
	},
});
