//TODO: - add stability to parser functionality
//      - handle css resources separately? "one for all"
// bug: why is resources triggered two times

var http = require('http'),
    url = require("url"),
    path = require('path'),
    fs = require('fs'),
    config = require('./serviceconfig.json'),
    extend = require('util')._extend,
    cacheWidgets = JSON.parse("[]"),
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

exports.initializeService = function(client) {
    
    if (config.clearresourcesonstartup=="true"){
        fs.readdirSync(path.join(__dirname, "resourcecache")).forEach(function(fileName) {
            fs.unlinkSync(path.join(__dirname, "resourcecache",fileName));
        });
    }

    client.subscribe('/addwidget', function(widget){
        console.log('widget added:'+widget.name);
        updateOrAppendWidget(widget);
    });
    
    client.subscribe('/addresource', function(resource){
        console.log('resource added:'+resource.filename);
        updateOrAppendResource(resource);
    });

    //listen for requests to refresh resources and widgets
    client.subscribe('/widgetrefreshrequested', function(message){
        sendWidgets(client);
        if (message.includeresources)
            sendResources(client);    
    });
        
    var server = http.createServer(function (request, response) {
        var data = '';
        var my_path = url.parse(request.url).pathname; 
        var resourceFile,resourcelocation, ext;
        
        request.on('data', function (chunk) {
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
            
            //TODO: is this required by android client? - dynamic creation of widgets? - use case?
            case '/addwidget/':
            request.on('end', function(){
                var jsonEventObj=JSON.parse(data);
                response.writeHead(200, { 'Content-Type': 'text/plain' });
                response.end('added widget');
                updateOrAppendWidget(jsonEventObj);
            });
            break;
            
            default:
            if (my_path.match(/\/resources\//g)){
                resourceFile=request.url.substring(request.url.lastIndexOf('/')+1);
                ext = path.extname(resourceFile);
                console.log("resource requested:"+resourceFile);

                if(!extensions[ext]){
                    //for now just send a 404 and a short message
                    response.writeHead(404, {'Content-Type': 'text/html'});
                    response.end("<html><head></head><body>The requested file type is not supported</body></html>");
                    console.log("non supported file type");
                }else{
                    resourcelocation=path.join(__dirname, "resourcecache",resourceFile);
                    console.log('resourcelocation:'+resourcelocation);
                    getFile(resourcelocation,response,extensions[ext]);
                };
                
            }else{
                response.writeHead(501, { 'Content-Type': 'text/html' });
                response.end('wrong url');
            };
        }
    }).listen(config.httpport);
    
    //Wait for other services to startup before sending request for widgetrefresh
    setTimeout(function(){
        client.publish('/widgetrefreshrequested', {includeresources:'true'});
    },500);
};

function updateOrAppendWidget(newWidget){
    for(var i = cacheWidgets.length - 1; i >= 0; i--) {
        if(cacheWidgets[i].name == newWidget.name)
            cacheWidgets.splice(i, 1);
    }
    cacheWidgets.push(newWidget);
}

function updateOrAppendResource(newResource){
    var resourcePath=path.join(__dirname, "resourcecache", newResource.filename);
    fs.writeFile(resourcePath, new Buffer(newResource.filecontent, 'base64'));
}
    
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
    }
}

function getFile(filePath,res,mimeType){
    fs.exists(filePath,function(exists){
        if(exists){
            fs.readFile(filePath,function(err,contents){
                if(!err){
                    res.writeHead(200,{
                        "Content-type" : mimeType,
                        "Content-Length" : contents.length
                    });
                    res.end(contents);
                } else {
                    console.dir(err);
                };
            });
        } else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end("<html><head></head><body>Cannot find the requested file</body></html>");
        };
    });
};