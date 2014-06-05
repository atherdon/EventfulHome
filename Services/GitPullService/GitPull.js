//Service listens /gitpullrequested
var spawn = require('child_process').spawn
var config = require('./serviceconfig.json');

exports.initializeService = function(client) {
    client.subscribe('/deploymentrequested', function(message){
        var sp=spawn(config.gitpullscript,[], {
   			detached: true
 		});

		sp.stdout.on('data', function (data) {
		  console.log('stdout: ' + data);
		});

		sp.stderr.on('data', function (data) {
		  console.log('stderr: ' + data);
		});

		sp.on('close', function (code) {
		  console.log('child process exited with code ' + code);
		});
    });
};