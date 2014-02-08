var http = require('http');

  var server = http.createServer(function (request, response) {
    var data = '';
    
    console.log('Incoming Request', { url: request.url });
    
    request.on('data', function (chunk) {
      data += chunk;
    });
    var resp="";
    response.writeHead(501, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(resp));
  });
  
  server.listen(20000);
  