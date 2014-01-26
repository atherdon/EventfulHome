// use lirc to control or arduino->ir-transmitter ()
//Service listens to watchtvlivingroom, watchmediapclivingroom, playps3livingroom, watchchromecastlivingroom, watchtvbedroom, watchmediapcbedroom, playps3bedroom, watchchromecastbedroom
var exec = require('child_process').exec;
var config = require('./serviceconfig.json');

exports.initializeService = function(client) {
    config.HDMISignals.forEach(function(item) {
        client.subscribe('/'+item.signal, function(message){
            console.log(config.commandpath+' SEND_ONCE \"'+item.remote+'\" \"'+item.command+'\"');
            //exec(config.commandpath+' SEND_ONCE \"'+item.remote+'\" \"'+item.signal+'\"', function (error, stdout, stderr) { console.log(stdout) });
        });
    });
};

