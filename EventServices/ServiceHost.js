// Run this node.js app on all machines included in the homeauto network
// command line parameters determines if this system also should act as the pubsub-hub
var stdio = require('stdio'),
    http = require('http'),
    fs = require('fs'),
    path_module = require('path'),
    faye = require('faye'),
    client,
    service_holder= [];

//commandline options
var ops = stdio.getopt({
    'localserver': {key: 'l', description: 'Run local pubhub server. Server and port information will be used by both server and services.'},
    'serveraddress': {key: 's', args: 1, mandatory: true, description: 'Host address for the pubhub server. Eg localhost'},
    'port': {key: 'p', args: 1, mandatory: true, description: 'The port for the pubhuv server. Eg 8080'}
});
//check for server address
if (!ops.serveraddress || !ops.port){
    ops.printHelp();
    process.exit(1);
}

//Start a local pubhub server if requested and get a client-ref
if (ops.localserver){ //
    console.log("Start local pubhub server");
    var server = http.createServer(),
    bayeux = new faye.NodeAdapter({mount: '/', timeout: 45});
    bayeux.attach(server);
    server.listen(ops.port);
    //set local client
    client=bayeux.getClient();
}else{
    //No local pubhub server - initialize client
    client = new faye.Client('http://'+ops.serveraddress+":"+ops.port);
    client.connect();
}

// dynamically load Services from /ActiveServices folder
var servicespath=path_module.join(process.env.PWD, "EventServices/Services");
var files = fs.readdirSync(servicespath);
var servicefile;
for(var i in files){
    servicefile=path_module.join(servicespath,files[i], "service.js");
    if (!fs.existsSync(servicefile)) continue;
    var module = require(servicefile);
    module.initializeService(client);    // each Service is initialized and could have long running async "processes" active (eg arduino-serial-monitor)
    service_holder[servicefile]=module;
}