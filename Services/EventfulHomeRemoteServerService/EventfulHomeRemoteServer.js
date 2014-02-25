//Example from here: http://blog.nodejitsu.com/a-simple-webservice-in-nodejs/
var http = require('http'),
    url = require("url"),
    path = require('path'),
    fs = require('fs'),
    config = require('./serviceconfig.json'),
    extend = require('util')._extend,
    cacheWidgets = config.basewidgets,
    resourceJSONArray=[],
    extensions = {
        ".html" : "text/html",
        ".css" : "text/css",
        ".js" : "application/javascript",
        ".png" : "image/png",
        ".gif" : "image/gif",
        ".jpg" : "image/jpeg",
        ".jpeg" : "image/jpeg"
    };

//TODO: - add stability to parser functionality
//      - check if resources has to be devided into binary and text resources
//      - add resource capability
//      - handle css resources separately? "one for all"
//      - refresh resource event?


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
        var resourceFile,
            ext;
        
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
                console.log ('complete json:'+data);
                var jsonEventObj=JSON.parse(data);
                
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.end('triggered event');
                client.publish(jsonEventObj.eventname,JSON.parse(jsonEventObj.data));
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
            if (my_path.match(/\/resources\//g)){
                resourceFile=request.url.substring(request.url.lastIndexOf('/')+1);
                ext = path.extname(resourceFile);
                if(!extensions[ext]){
                    //for now just send a 404 and a short message
                    response.writeHead(404, {'Content-Type': 'text/html'});
                    response.end("<html><head></head><body>The requested file type is not supported</body></html>");
                };

                response.end('the file:'+extensions[ext]);
                
                console.log(resourceFile);
                
            }else{
                response.writeHead(501, { 'Content-Type': 'application/json' });
                response.end('wrong url');
            };
        }
        
    }).listen(config.httpport);
    
    setTimeout(function(){client.publish('/widgetrefreshrequested', {includeresources:'true'});},3000);
};

function updateOrAppendWidget(newWidget){
    console.log(cacheWidgets);
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
    