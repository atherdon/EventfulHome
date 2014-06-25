//Service listens to controlmusic(location, command), allmediaoff, playmusic(location, playlist) 
var SqueezeServer = require('squeezenode');
var config = require('./serviceconfig.json');

exports.initializeService = function(client) {
    squeeze = new SqueezeServer(config.LMSServer, config.LMSPort);
    
    squeeze.on('register', function(){
        //you're ready to use the api, eg.
        squeeze.getPlayers( function(reply) {
            console.log(reply.result[0]);
        });
    });

    client.subscribe('/allmediaoff', function(message){
        
    });
    client.subscribe('/controlmusic', function(message){
        //message.location, message.command
    });
    client.subscribe('/playmusic', function(message){
        //message.location, message.genre        
    });
};
