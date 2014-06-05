//Service is used to trigger events for test purposes 
exports.initializeService = function(client) {
    //client.subscribe('/somethingtolistento', function(message){console.log(message);});
    setTimeout(function(){client.publish('/watchitt', {roomnr:'3'});}, 4000);
};