// use lirc to control pvr
//Service listens to pvrcommandrequested

var exec = require('child_process').exec,
	config = require('./serviceconfig.json'),
	path = require('path'),
	fs = require('fs');

exports.initializeService = function(client) {
    //listen for signals to transmit 
    client.subscribe('/pvrcommandrequested', function(message){
    	console.log(message);
    	console.log("message:"+message.signal);
        console.log(config.commandpath+' SEND_ONCE \"'+config.remote+'\" \"'+message.signal+'\"');
        exec(config.commandpath+' SEND_ONCE \"'+config.remote+'\" \"'+message.signal+'\"', function (error, stdout, stderr) { console.log(stdout) });
    });

    //Wait with sending resources and widgets to ensure listening services are ready
    //send resources and widgets
    setTimeout(function(){
        sendWidgets(client);
        sendResources(client);
        //start listening for requests to refresh resources and widgets
        client.subscribe('/widgetrefreshrequested', function(message){
            sendWidgets(client);
            if (message.includeresources)
                sendResources(client);    
        });
    },1000);
};

function sendWidgets(client){
    var widgetFile,
        newWidgetJSON,
        widgetName;
    var widgetPath=path.join(__dirname, "widgets");
    var files = fs.readdirSync(widgetPath);
    for(var i in files){
        widgetFile=path.join(widgetPath,files[i]);
        if (fs.lstatSync(widgetFile).isDirectory())
             continue;

        widgetName=files[i].substr(0,files[i].lastIndexOf('.'));
        newWidgetJSON={ "name":widgetName, "htmlstring":fs.readFileSync(widgetFile, "utf8")};
        client.publish('/addwidget', newWidgetJSON);            
    }
}

function sendResources(client){
    var resourceFile,
        newResourceJSON;
    var resourcePath=path.join(__dirname, "widgets","resources");
    var files = fs.readdirSync(resourcePath);
    for(var i in files){
        resourceFile=path.join(resourcePath,files[i]);
        newResourceJSON={ "filename":files[i], "filecontent":new Buffer(fs.readFileSync(resourceFile) || '').toString('base64')};
        client.publish('/addresource', newResourceJSON);
        console.log("new resource added:"+files[i]);
    }
}