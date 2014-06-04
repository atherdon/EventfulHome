//Service is used to trigger events for test purposes 
exports.initializeService = function(client) {
    //client.subscribe('/somethingtolistento', function(message){console.log(message);});
    setTimeout(function(){client.publish('/widgetrefreshrequested', { "includeresources" :"true"});}, 10000);
	setTimeout(function(){client.publish('/pvrcommandrequested', { "signal" :"pause" });}, 15000);
};