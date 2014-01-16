var SqueezeServer = require('squeezenode');
var squeeze = new SqueezeServer('http://jakemedia', 9000);
//subscribe for the 'register' event to ensure player registration is complete

squeeze.on('register', function(){
    //you're ready to use the api, eg.
    squeeze.getPlayers( function(reply) {
	
	//reply.result[0].getCurrentTitle( function(reply) {
		console.dir(reply);

	});
            
    });
});


https://github.com/piotrraczynski/squeezenode

