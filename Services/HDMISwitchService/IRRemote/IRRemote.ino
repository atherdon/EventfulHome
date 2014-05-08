#define IRledPin 12
// Buffer for the incoming data
char inData[100];
// Buffer for the parsed data chunks
char *inParse[100];

// Storage for data as string
String inString = "";

// Incoming data id
int index = 0;
// Read state of incoming data
boolean stringComplete = false;

void setup() {
  Serial.begin(9600);
  pinMode(IRledPin, OUTPUT);
  digitalWrite(IRledPin, LOW);
  // reserve 200 bytes for the inputString:
  inputString.reserve(400);
}

void loop() {
  if (stringComplete) {
    int sepPosition;  // the position of the next comma in the string
    int mpulses[200];
    int mdelays[200];
    int sizeOfSignal=0;
    int IRpulse;
    int IRdelay;
    String pulseAndDelay;
    
    do{
      sepPosition = inputString.indexOf(';');
      if(sepPosition != -1){
          pulseAndDelay=inputString.substring(0,sepPosition);
                      
          inputString = inputString.substring(sepPosition+1, inputString.length());
      }
      else{  
        if(inputString.length() > 0)
          pulseAndDelay=inputString;  
      }
      //Add pulses and delays to arrays
      mpulses[sizeOfSignal]=pulseAndDelay.substring(0,pulseAndDelay.indexOf(',')).toInt();
      mdelays[sizeOfSignal]=pulseAndDelay.substring(pulseAndDelay.indexOf(',')+1, pulseAndDelay.length()).toInt();
      sizeOfSignal+=1;
      
    }
    while(sepPosition >=0);
    
    //Now we have the complete string converted to arrays of pulses and delays
    for (int i = 0; i < sizeOfSignal; i+=1) {         //Loop through all of the IR timings
      pulseIR(mpulses[i]*10);              //Flash IR LED at 38khz for the right amount of time
      delayMicroseconds(mdelays[i]*10);  //Then turn it off for the right amount of time
    }
    
    // clear the string:
    inputString = "";
    stringComplete = false;
  }
}

/*
  SerialEvent occurs whenever a new data comes in the
 hardware serial RX.  This routine is run between each
 time loop() runs, so using delay inside loop can delay
 response.  Multiple bytes of data may be available.
 */
void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read(); 
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag
    // so the main loop can do something about it:
    if (inChar == '\n') {
      stringComplete = true;
    } 
  }
}

// This function allows us to PWM the IR LED at about 38khz for the sensor
// Borrowed from Adafruit!
void pulseIR(long microsecs) {
  // we'll count down from the number of microseconds we are told to wait
  cli();  // this turns off any background interrupts
  while (microsecs > 0) {
    // 38 kHz is about 13 microseconds high and 13 microseconds low
    digitalWrite(IRledPin, HIGH);  // this takes about 3 microseconds to happen
    delayMicroseconds(10);         // hang out for 10 microseconds, you can also change this to 9 if its not working
    digitalWrite(IRledPin, LOW);   // this also takes about 3 microseconds
    delayMicroseconds(10);         // hang out for 10 microseconds, you can also change this to 9 if its not working
    // so 26 microseconds altogether
    microsecs -= 26;
  }
  sei();  // this turns them back on
}

