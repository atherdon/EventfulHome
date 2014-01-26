//Service for watering and monitoring a balcony garden - service listens to shortmanualwatering and should publish newsensorvalue, lowwaterleveldetected
/* insperation: 


*/
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