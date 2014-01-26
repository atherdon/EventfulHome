// use http-post to control yamaha receiver
// httppost info: http://openremote.org/display/forums/Controlling++RX+2065+Yamaha+Amp , http://www.theroamingcoder.com/node/111
//Service listens to watchtvlivingroom, watchmediapclivingroom, playps3livingroom, watchchromecastlivingroom, playmusiclivingroom, allmediaoff
var config = require('./serviceconfig.json');
var http = require('http');  

exports.initializeService = function(client) {
    config.receivermodes.forEach(function(item) { 
        client.subscribe('/'+item.receivermode, function(message){
            console.log('sending:'+item.commands);
            SeqHttpReq(item.commands);
        });
    });
};

function SeqHttpReq(postdataarray){
    if (postdataarray.length<1) return;
    
    var currentPost=postdataarray.shift();
    var httpreq=http.request({
        host: config.receiverhost,
        port: config.receiverport,
        path: config.receiverpath,
        method: 'POST'
    }, function(resp) {
        console.log('sent:'+currentPost+'    \nresp-code:'+resp.statusCode);
        //Wait for the receiver to execute the command before calling the next command (delay)
        setTimeout( function (){
            SeqHttpReq(postdataarray);
        }, 500);
    });
    httpreq.write(currentPost);
    httpreq.end();
}