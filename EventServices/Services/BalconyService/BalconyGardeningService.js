exports.initializeService = function(client) {
    client.subscribe('/smallevent', function(message){
        client.publish('/bigevent', {
                text:     'bigevent created from small event!',
                howbig:   'big'
        });
    });
};