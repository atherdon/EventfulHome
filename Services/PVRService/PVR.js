// use lirc to control pvr
//Service listens to pvrcommandrequested

var exec = require('child_process').exec,
	config = require('./serviceconfig.json'),
	path_module = require('path'),
	fs = require('fs');

exports.initializeService = function(client) {
    //listen for signals to transmit 
    client.subscribe('/pvrcommandrequested', function(message){
    	console.log(message);
    	console.log("message:"+message.signal);
        console.log(config.commandpath+' SEND_ONCE \"'+config.remote+'\" \"'+message.signal+'\"');
        exec(config.commandpath+' SEND_ONCE \"'+config.remote+'\" \"'+message.signal+'\"', function (error, stdout, stderr) { console.log(stdout) });
    });

    //listen for requests to refresh resources and widgets
	client.subscribe('/widgetrefreshrequested', function(message){
    	console.log("refresh requested");
    	sendWidgets(client);
    	//if (message.includeresources)
    	//	sendResources(client);    
    });

    //send resources and widgets
    //setTimeout(function(){sendWidgets(client);},4000);
    //sendResources(client);

};

function sendWidgets(client){
	var widgetFile,
		newWidgetJSON;
	var widgetPath=path_module.join(__dirname, "widgets");
	var files = fs.readdirSync(widgetPath);
	for(var i in files){
	    widgetFile=path_module.join(widgetPath,files[i]);
		newWidgetJSON={ "name":files[i], "htmlstring":fs.readFileSync(widgetFile, "utf8")};
		client.publish('/addwidget', newWidgetJSON);
		console.log(JSON.stringify(newWidgetJSON));
	}
}
