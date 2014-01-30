// use lirc to control or arduino->ir-transmitter ()
//Service listens to watchtvlivingroom, watchmediapclivingroom, playps3livingroom, watchchromecastlivingroom, watchtvbedroom, watchmediapcbedroom, playps3bedroom, watchchromecastbedroom
var exec = require('child_process').exec;
var config = require('./serviceconfig.json');
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var arduinoready=false;

var serialPort;

exports.initializeService = function(client) {
    serialPort= new SerialPort(config.serialport, {
        baudrate: 9600,
         dataBits: 8, 
         parity: 'none', 
         stopBits: 1, 
         flowControl: false 
    });
    
    serialPort.on("open", function () {
      console.log("serialport open");
      arduinoready=true;
      serialPort.on("close", function(data) {
        console.log("serialport closed");
        arduinoready=false;
      });
      serialPort.on("data", function(data) {
        console.log("from arduino:"+data);
      });
    });

    config.scenes.forEach(function(item) {
        client.subscribe('/'+item.scene, function(message){
            console.log(item.signal);
            if (arduinoready){
                serialPort.write(item.signal+"\n", function(err, results) {
                    console.log('err ' + err);
                    console.log('results ' + results);
                });   
            }
        });
    });
};

