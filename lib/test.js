Crafty.c('TestOject', {
	init: function() {
		this.requires('2D, Mouse')
		.h = 100;
		this.w = 100;
		this.bind('Click', function(e) {
			console.log(e);
		})
	}
});

Crafty.e('TestOject');