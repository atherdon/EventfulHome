//Base service on squeezenode: https://github.com/piotrraczynski/squeezenode

//Service listens to xbmcpause, xbmcstop, play, mute, open(content),  - all with roomnr as argument
//should listen to setspecificlight (tellstick-argument-specific)
var SqueezeServer = require('squeezenode');
var squeeze;
var config = require('./serviceconfig.json');
var currentSubscriptions = ['lightsonsoft', 'lightsonbright', 'lightsoff', 'setspecificlight'];

exports.initializeService = function(client) {
    squeeze = new SqueezeServer('http://jakemedia', 9000);
    
    currentSubscriptions.forEach(function(item) { 
        client.subscribe('/'+item, function(message){
            executeLightCommand(item, message);
        });
    });
};

//subscribe for the 'register' event to ensure player registration is complete

squeeze.on('register', function(){
    //you're ready to use the api, eg.
    squeeze.getPlayers( function(reply) {
	
	//reply.result[0].getCurrentTitle( function(reply) {
		console.dir(reply);

	});
            
    });
});




