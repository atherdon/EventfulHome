//Example from here: http://blog.nodejitsu.com/a-simple-webservice-in-nodejs/
var http = require('http'),
    url = require("url"),
    config = require('./serviceconfig.json'),
    extend = require('util')._extend;

var cacheWidgets = extend({}, config.basewidgets);
var resourceJSONArray=[];

exports.initializeService = function(client) {
    
    client.subscribe('/addwidget', function(widget){
        console.log('widget added:'+widget.name);
        updateOrAppendWidget(widget);
    });
    
    client.subscribe('/addresource', function(resource){
        console.log('resource added:'+resource.filename);
        updateOrAppendResource(resource);
    });
        
    var server = http.createServer(function (request, response) {
        var data = '';
        var my_path = url.parse(request.url).pathname; 
        
        console.log('mypath:'+my_path);
        console.log('Incoming Request', { url: request.url });
    
        request.on('data', function (chunk) {
          console.log(chunk);
          data += chunk;
        });
    
        switch(my_path)
        {
            case '/getwidgets/':
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify(cacheWidgets));
            break;
            
            case '/triggerevent/':
            request.on('end', function(){
                var jsonEventObj=JSON.parse(data);
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.end('triggered event');
                console.log ('complete json:'+data);
                client.publish(jsonEventObj.eventname,jsonEventObj.data);
            });
            break;
            
            case '/addwidget/':
            request.on('end', function(){
                var jsonEventObj=JSON.parse(data);
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.end('added widget');
                console.log ('complete json:'+data);
                updateOrAppendWidget(jsonEventObj);
            });
            break;
            
            default:
            response.writeHead(501, { 'Content-Type': 'application/json' });
            response.end('wrong url');
        }
        
    });
    server.listen(config.port);
    
    client.publish('/widgetrefreshrequested', {includeresources:'true'});
};

function updateOrAppendWidget(newWidget){
    for(var i = cacheWidgets.length - 1; i >= 0; i--) {
        if(cacheWidgets[i].name == newWidget.name)
            cacheWidgets.splice(i, 1);
    }
    cacheWidgets.push(newWidget);
}

function updateOrAppendResource(newResource){
    for(var i = resourceJSONArray.length - 1; i >= 0; i--) {
        if(resourceJSONArray[i].name == newResource.name)
            resourceJSONArray.splice(i, 1);
    }
    resourceJSONArray.push(newResource);
}
    
  