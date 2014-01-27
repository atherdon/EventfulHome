//Service is used to trigger events for test purposes 
exports.initializeService = function(client) {
    //client.subscribe('/somethingtolistento', function(message){console.log(message);});
    setTimeout(function(){client.publish('/watchtvlivingroom', {roomnr:'3'});}, 4000);
    setTimeout(function(){client.publish('/watchmediapclivingroom', {roomnr:'3'});}, 6000);
    setTimeout(function(){client.publish('/playps3livingroom', {roomnr:'3'});}, 8000);
    setTimeout(function(){client.publish('/watchchromecastlivingroom', {roomnr:'3'});}, 10000);
    setTimeout(function(){client.publish('/watchtvbedroom', {roomnr:'3'});}, 12000);
    setTimeout(function(){client.publish('/watchmediapcbedroom', {roomnr:'3'});}, 14000);
    setTimeout(function(){client.publish('/playps3bedroom', {roomnr:'3'});}, 16000);
    setTimeout(function(){client.publish('/watchchromecastbedroom', {roomnr:'3'});}, 18000);
};