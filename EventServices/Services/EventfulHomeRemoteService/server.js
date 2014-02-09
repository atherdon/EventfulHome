//Example from here: http://blog.nodejitsu.com/a-simple-webservice-in-nodejs/


var http = require('http'),
    widgets = require('./widgethtml.json');

  var server = http.createServer(function (request, response) {
    var data = '';
    
    console.log('Incoming Request', { url: request.url });
    
    request.on('data', function (chunk) {
      data += chunk;
    });
   
    response.writeHead(501, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(widgets));
  });
  
  server.listen(20000);
  
  
  