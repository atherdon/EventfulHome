//Service is used to trigger events for test purposes 
exports.initializeService = function(client) {
    client.subscribe('/somethingtolistento', function(message){console.log(message);});
    setTimeout(function(){ 
        client.publish('/lightsonsoft', {
            roomnr:     '3'
        });
        setTimeout(function(){ 
            client.publish('/watchtvlivingroom', {'command':'pause'});
        }, 5000);
    }, 1000);
};