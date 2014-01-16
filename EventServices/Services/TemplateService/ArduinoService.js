// http://www.barryvandam.com/node-js-communicating-with-arduino/

//configuration of port
var nconf = require('nconf');
nconf.file({ file: 'config.json' });
// Provide default values for settings not provided above.
nconf.defaults({
    'arduinoport': '/dev/ttyUSB0'
});  //accessable through nconf.get('arduinoport')


var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

var sp = new SerialPort(nconf.get('arduinoport'), {
  parser: serialport.parsers.readline("\n")
});

sp.open(function () {
  console.log('open');
  sp.on('data', function(data) {
    try
	{
		var j = JSON.parse(data);
		console.log( j.celsius);
	}
	catch (ex)
	{
		console.warn(ex);
	}
  });
  
  sp.write("ls\n", function(err, results) {
    console.log('err ' + err);
    console.log('results ' + results);
  });
});

//arduino module should communicate json like this: 
//Sending a JSON string over Serial/USB like: {"ab":"123","bc":"234","cde":"3546"}
//	Serial.println("{\"adc\":\"" + String((long)round(100.0 * rawADC1)) +
//			"\", \"celsius\":\"" + String((long)round(100.0 * thermistor(rawADC1, Resistance1))) +
//			"\", \"adc2\":\"" + String((long)round(100.0 * rawADC2)) +
//			"\", \"celsius2\":\"" + String((long)round(100.0 * thermistor(rawADC2, Resistance2))) +
//			"\"}");

//// form a JSON-formatted string:   http://www.tigoe.com/pcomp/code/arduinowiring/1109/
//    String jsonString = "{\"x\":\"";
//    jsonString += x;
//    jsonString +="\",\"y\":\"";
//    jsonString += y;
//    jsonString +="\",\"z\":\"";
//    jsonString += z;
//    jsonString +="\"}";

// print it:
//  Serial.println(jsonString);


