// Use one of these
// https://npmjs.org/browse/keyword/xbmc

// https://github.com/PaulAvery/xbmc-ws
// https://npmjs.org/package/xbmc-ws
// https://github.com/moul/node-xbmc/tree/master/examples
// https://github.com/martinverup/node-xbmc-rpc

//Service listens to xbmcpause, xbmcstop, play, mute, open(content),  - all with roomnr as argument
//should listen to setspecificlight (tellstick-argument-specific)
var config = require('./serviceconfig.json');
var currentSubscriptions = ['lightsonsoft', 'lightsonbright', 'lightsoff', 'setspecificlight'];

exports.initializeService = function(client) {
    currentSubscriptions.forEach(function(item) { 
        client.subscribe('/'+item, function(message){
            executeLightCommand(item, message);
        });
    });
};
