//Service listens to lightsonsoft, lightsonbright, lightsoff - all with roomnr as argument
//should listen to setspecificlight (tellstick-argument-specific)
//an alternative to using tellstick could be rc-
var exec = require('child_process').exec;

var config = require('./serviceconfig.json');
var tdtoolpath = '/var/lib/stickshift/52bc7df85004460774000158/app-root/data/670589/tdtool';
var currentSubscriptions = ['lightsonsoft', 'lightsonbright', 'lightsoff', 'setspecificlight'];

exports.initializeService = function(client) {
    currentSubscriptions.forEach(function(item) { 
        client.subscribe('/'+item, function(message){
            executeLightCommand(item, message);
        });
    });
};
  
function executeLightCommand(commandtype, message){
    if (commandtype=='setspecificlight'){
        //handle specific case
        console.log("specific lights: id="+message.id+" command="+message.command+" dimlevel="+message.dimlevel);
    }
    else{
        for (var i=0; i<config.roomlights.length; i++){
            if (message.roomnr == config.roomlights[i].roomnr){
                //exec(tdtoolpath+' '+config.roomlights[i][commandtype], function (error, stdout, stderr) { console.log(stdout) });
                console.log(tdtoolpath+' '+config.roomlights[i][commandtype]);
                break;
            }
        }
    }
}

