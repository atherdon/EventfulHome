//Example from here: http://blog.nodejitsu.com/a-simple-webservice-in-nodejs/
var http = require('http'),
    widgets = require('./widgethtml.json'),
    url = require("url");

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
        response.end(JSON.stringify(widgets));
        break;
        
        case '/triggerevent/':
        request.on('end', function(){
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end('triggered event');
            console.log ('complete json:'+data); 
        });
        break;
        
        default:
        response.writeHead(501, { 'Content-Type': 'application/json' });
        response.end('wrong url');
    }
    
});
server.listen(20000);
  
  
  