// use http-post to control yamaha receiver
// httppost info: http://openremote.org/display/forums/Controlling++RX+2065+Yamaha+Amp , http://www.theroamingcoder.com/node/111
//Service listens to watchtvlivingroom, watchmediapclivingroom, playps3livingroom, watchchromecastlivingroom, playmusiclivingroom, allmediaoff
var config = require('./serviceconfig.json');
var http = require('http');  

exports.initializeService = function(client) {
    config.receivermodes.forEach(function(item) { 
        client.subscribe('/'+item.receivermode, function(message){
            item.commands.forEach(function(cmd){
                console.log(cmd);
                var httpreq=http.request({
                    host: config.receiverhost,
                    port: config.receiverport,
                    path: config.receiverpath,
                    method: 'POST'
                }, function(resp) {
                    console.log(resp.statusCode);
                });
                httpreq.write(cmd);
                httpreq.end();
            });
        });
    });
};