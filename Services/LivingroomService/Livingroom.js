// Use combination of Yamaha-receiver-style (configurable scenes with multiple codes to transmit) and PVRService to listen to samsung commands? (room?)
var config = require('./serviceconfig.json');

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
        	var res=data.split(";");
        	if (res.length<1) return; 
        	switch (res[0]){
        	case "IRSIGNAL":
        		var irsignalJSONStr="{ type: '"+res[1]+"', signal: '"+res[2]+"',  bits: '"+res[3]+"'}";
        		client.publish('/irsignal', JSON.parse(JSONStr));
        		break;
        	case "SENSORREAD":
        		var sensorJSONStr="{ type: '"+res[1]+"', source: '"+res[2]+"' value: '"+res[3]+"', datetime: '"+Date.now()+"'}";
                client.publish('/sensorread', JSON.parse(JSONStr));
                break;
        	}
      	});
    });

    //TODO: something like PVR "command requested"
    



    config.scenes.forEach(function(item) { 
        client.subscribe('/'+item.scene, function(message){
            SeqArduinoReq(item.commands);
        });
    });
};

function SeqArduinoReq(postdataarray){
    if (postdataarray.length<1 || !arduinoready) return;

    var currentPost=postdataarray.shift();

    console.log("sending ir - Type: "+currentPost.irtype+" Signal: "+currentPost.irsignal+" Bits: "+currentPost.bits);
    var arduinoStr="SENDIR;"+currentPost.irtype+";"+currentPost.irsignal+";"+currentPost.bits+"\n";

    serialPort.write(arduinoStr, function(err, results) {
        console.log('err: ' + err);
        console.log('results: ' + results);
		//Wait for the ir command to be sent then send the next command (delay)
        setTimeout( function (){
            SeqArduInoReq(postdataarray);
        }, 50);
    });   
}