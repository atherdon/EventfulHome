//Service for watering and monitoring a balcony garden - service listens to shortmanualwatering and should publish newsensorvalue, lowwaterleveldetected
//Config should describe optimal water levels and warning levels. Service should be triggered by timer and send warning if water level in tank goes below critival level (config)
/* 
    sensorread
        type
        source
        value
        datetime

*/
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
            case "SENSORREAD":
                var sensorJSONStr="{ type: '"+res[1]+"', source: '"+res[2]+"' value: '"+res[3]+"', datetime: '"+Date.now()+"'}";
                client.publish('/sensorread', JSON.parse(JSONStr));
                break;
            }
        });

        //set default sensorread freq - TODO: do sensor specific?
        SendCommandToArduino("SETFREQ;*;10");
    });

    client.subscribe('/manualwateringrequested', function(message){
        console.log('performing manual watering');
        SendCommandToArduino("WATER;*;"+config.shortmanualwateringtime);   
    });

    //TODO: allow for sensor specific freq    
    client.subscribe('/changedsensorreadfrequencyrequested', function(message){
        console.log('setting sensor read frequency to read after (s): '+message.freq);
        SendCommandToArduino("SETFREQ;*;"+message.freq);  
    });
};

function SendCommandToArduino(arduinoStr){
    var arraytoholdcmd=[arduinoStr];
}

function SeqArduinoReq(postdataarray){
    if (postdataarray.length<1 || !arduinoready) return;

    var currentPost=postdataarray.shift();
    console.log('sending command: '+arduinoStr);
    serialPort.write(arduinoStr, function(err, results) {
        console.log('err: ' + err);
        console.log('results: ' + results);
        //Wait for the ir command to be sent then send the next command (delay)
        setTimeout( function (){
            SeqArduInoReq(postdataarray);
        }, 50);
    });   
}
