//Service listens /gitpullrequested
var exec = require('child_process').exec;
var config = require('./serviceconfig.json');

exports.initializeService = function(client) {
    client.subscribe('/deploymentrequested', function(message){
        exec(config.gitpullscript, function (error,stdout,stderr) {console.log(stdout);)};
    });
};