//Service listens /gitpullrequested
var config = require('./serviceconfig.json');
var fs = require('fs'),
    spawn = require('child_process').spawn;
 
exports.initializeService = function(client) {
    client.subscribe('/deploymentrequested', function(message){
		var out = fs.openSync('(tmp/git.log', 'a'),
	    	err = fs.openSync('/tmp/git.log', 'a');

	 	var child = spawn(config.gitpullscript, [], {
	   		detached: true,
	   		stdio: [ 'ignore', out, err ]
		});

		child.unref();
	});
};