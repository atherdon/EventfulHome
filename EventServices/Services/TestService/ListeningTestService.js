//Service is used to trigger events for test purposes 
exports.initializeService = function(client) {
    client.subscribe('/*', function(message){console.log(message);});
};