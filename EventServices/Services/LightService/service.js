//should listen to LightsOnSoft, LightsOnBright, LigtsOff - all with roomnr as argument
//should listen to LightsSetSpecific (tellstick-argument-specific)
exports.initializeService = function(client) {
    client.subscribe('/bigevent', function(message){
        console.log("wow - a big event received:");
        console.log(message);
    });
};
