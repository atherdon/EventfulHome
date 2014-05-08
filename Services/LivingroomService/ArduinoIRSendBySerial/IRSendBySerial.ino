#include <IRremoteInt.h>
#include <IRremote.h>
#include "dht.h"


String inputString = "";       
boolean stringComplete = false;
const int RECV_PIN = 2;

String command;
String param1;
String param2;
String param3;
String param4;

IRrecv irrecv(RECV_PIN);
IRsend irsend;
decode_results results;

#define dht_dpin 5
dht DHT;
long DHTlastCheck=0;
long DHTinterval=10000;

void setup()
{
  Serial.begin(9600);
  irrecv.enableIRIn(); // Start the receiver
  irrecv.blink13(true);
  inputString.reserve(400);
  DHTlastCheck=millis();
}

void loop() {
  ListenForIR();
  ListenForMovement();
  ListenForDHT();
  if (stringComplete)
  {
    // Parse the recieved data
    ParseSerialData();  
    ExecuteSerialCommand();
    
    // Reset inString to empty
    inputString = "";
    // Reset the system for further
    // input of data
    stringComplete = false;
    Serial.flush();
  }
}

void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read(); 
    inputString += inChar;
    if (inChar == '\n') {
      stringComplete = true;
    } 
  }
}

void ExecuteSerialCommand(){
 
  if (command=="SENDIR") {
    if (param1=="NEC") {
      //Serial.println("sending nec"+param2); 
      irsend.sendNEC(getLongFromHexString(param2),param3.toInt());
    }
    else if (param1=="SONY"){
      //Serial.println("sending sony"+param2); 
      irsend.sendSony(getLongFromHexString(param2),param3.toInt());      
    }
    else if (param1=="SAMSUNG"){
      //Serial.println("sending samsung"+param2); 
      irsend.sendSamsung(getLongFromHexString(param2),param3.toInt());      
    }
    else if (param1=="JVC"){
      //Serial.println("sending samsung"+param2); 
      irsend.sendJVC(getLongFromHexString(param2),param3.toInt(),param4.toInt());      
    }
    else if (param1=="PANASONIC"){
      //Serial.println("sending samsung"+param2); 
      irsend.sendPanasonic(getLongFromHexString(param2),param3.toInt());      
    }
    else if (param1=="RC5"){
      //Serial.println("sending samsung"+param2); 
      irsend.sendRC5(getLongFromHexString(param2),param3.toInt());      
    }
    else if (param1=="RC6"){
      //Serial.println("sending samsung"+param2); 
      irsend.sendRC6(getLongFromHexString(param2),param3.toInt());      
    }
    else if (param1=="RAW"){
      int sepPosition=0;  // the position of the next comma in the string
      int mOldSepPosition=-1;
      unsigned int msignal[200];
      int sizeOfSignal=0;
      unsigned int mpart;
      //Serial.print("fullparam2:");
      //Serial.println(param2);
      do{
        sepPosition = param2.indexOf(',',mOldSepPosition+1);
        if(sepPosition != -1){
            mpart=param2.substring(mOldSepPosition+1,sepPosition).toInt();
            //Serial.println("+"+String(mpart)+"+ oldsep:"+String(mOldSepPosition)+" seppos:"+String(sepPosition));
        }
        else{  
          if(mOldSepPosition < param2.length()){
            mpart=param2.substring(mOldSepPosition+1).toInt();
            //Serial.println("+"+String(mpart)+"+ oldsep:"+String(mOldSepPosition)+" seppos:"+String(sepPosition));
          }
        }

        //Add part to arrays
        msignal[sizeOfSignal]=mpart;
        sizeOfSignal+=1;
        mOldSepPosition=sepPosition;
      }
      while(sepPosition >=0);
      
      irsend.sendRaw(msignal,sizeOfSignal,param3.toInt());
      
      //unsigned int S_pwr[68]={4650,4350,700,1600,600,1650,600,1650,600,500,600,550,550,550,550,600,500,600,500,1750,550,1700,550,1700,550,550,550,600,500,600,550,550,550,600,500,600,500,1750,500,600,550,550,550,600,500,600,550,550,550,600,500,1750,500,600,500,1750,550,1700,550,1700,550,1700,550,1700,550,1700,550};
      // SENDIR;RAW;4650,4350,700,1600,600,1650,600,1650,600,500,600,550,550,550,550,600,500,600,500,1750,550,1700,550,1700,550,550,550,600,500,600,550,550,550,600,500,600,500,1750,500,600,550,550,550,600,500,600,550,550,550,600,500,1750,500,600,500,1750,550,1700,550,1700,550,1700,550,1700,550,1700,550;38

      //irsend.sendRaw(S_pwr,68,38);
      
      //Serial.print("Sent raw signal with length:");
      //Serial.println(String(sizeOfSignal));
      //Serial.print("?{");
      //for (int i=1; i < sizeOfSignal; i++){
      //  Serial.print(String(msignal[i]));
      //  if (i<sizeOfSignal-1){
      //    Serial.print(",");
      //  }
      //}
      //Serial.print("}");
    }
    irrecv.enableIRIn();
  }
  else if (command=="READSENDOR"){
    //TODO read temp
    Serial.println("SENSORREAD:"+param1);
  }
}

long getLongFromHexString(String hexString){
  char *p;
  unsigned long ulngCode = 0x0;
  char mCharArray[hexString.length()+1];
  hexString.toCharArray(mCharArray,hexString.length()+1);
  ulngCode = strtoul(mCharArray, &p, 16);
  //Serial.println("the string:*"+hexString+"*end");
  //Serial.print("the code:*");
  //Serial.print(ulngCode, HEX);
  //Serial.println("*end");
  return ulngCode;
}

void ListenForIR(){
  if (irrecv.decode(&results)) {
    //Serial.println("some ir signal received");
    if (results.decode_type == NEC) {
      Serial.print("IRSIGNAL;NEC;");
      Serial.print(results.value, HEX);
      Serial.println(";"+String(results.bits));
    } else if (results.decode_type == SONY) {
      Serial.print("IRSIGNAL;SONY;");
      Serial.print(results.value, HEX);
      Serial.println(";"+String(results.bits));
    } else if (results.decode_type == RC5) {
      Serial.print("IRSIGNAL;RC5;");
      Serial.print(results.value, HEX);
      Serial.println(";"+String(results.bits));
    } else if (results.decode_type == RC6) {
      Serial.print("IRSIGNAL;RC6;");
      Serial.print(results.value, HEX);
      Serial.println(";"+String(results.bits));
    } else if (results.decode_type == DISH) {
      Serial.print("IRSIGNAL;DISH;");
      Serial.print(results.value, HEX);
      Serial.println(";"+String(results.bits));
    } else if (results.decode_type == SHARP) {
      Serial.print("IRSIGNAL;SHARP;");
      Serial.print(results.value, HEX);
      Serial.println(";"+String(results.bits));
    } else if (results.decode_type == JVC) {
      Serial.print("IRSIGNAL;JVC;");
      Serial.print(results.value, HEX);
      Serial.println(";"+String(results.bits));
    } else if (results.decode_type == PANASONIC) {
      Serial.print("IRSIGNAL;PANASONIC;");
      Serial.print(results.value, HEX);
      Serial.println(";"+String(results.bits));
    } else if (results.decode_type == SAMSUNG) {
      Serial.print("IRSIGNAL;SAMSUNG;");
      Serial.print(results.value, HEX);
      Serial.println(";"+String(results.bits));
    } else if (results.decode_type == UNKNOWN) {
      Serial.print("IRSIGNAL;UNKNOWN;");
      //Send raw
      String rawStr="";
      for (int i=1; i < results.rawlen; i++){
        rawStr+=String(results.rawbuf[i]*USECPERTICK);
        if (i<results.rawlen-1){
          rawStr+=",";
        }
      }
      Serial.println(rawStr);      
    }
    irrecv.resume(); // Receive the next value
  }
}

void ListenForMovement(){

}

void ListenForDHT(){
  long checktime=millis();
  if (DHTlastCheck+DHTinterval <= checktime){
    DHT.read22(dht_dpin);
    Serial.print("SENSORREAD;TEMP;1;");
    Serial.println((float)DHT.temperature, 2);
    Serial.print("SENSORREAD;HUM;2;");
    Serial.println((float)DHT.humidity, 2);
    DHTlastCheck=checktime;
  }
}

void ParseSerialData(){
    int sepPosition;
    
    sepPosition = inputString.indexOf(';');
    if(sepPosition != -1){
        command=inputString.substring(0,sepPosition);                    
        inputString = inputString.substring(sepPosition+1, inputString.length());
    }
    
    //Param1
    sepPosition = inputString.indexOf(';');
    if(sepPosition != -1){
        param1=inputString.substring(0,sepPosition);                    
        inputString = inputString.substring(sepPosition+1, inputString.length());
    }
    else{  
      if(inputString.length() > 0)
          param1=inputString;  
    }
    
    //Param2
    sepPosition = inputString.indexOf(';');
    if(sepPosition != -1){
        param2=inputString.substring(0,sepPosition);                    
        inputString = inputString.substring(sepPosition+1, inputString.length());
    }
    else{  
      if(inputString.length() > 0)
          param2=inputString;  
    }
    
    //Param3
    sepPosition = inputString.indexOf(';');
    if(sepPosition != -1){
        param3=inputString.substring(0,sepPosition);                    
        inputString = inputString.substring(sepPosition+1, inputString.length());
    }
    else{  
      if(inputString.length() > 0)
          param3=inputString;  
    }
 
    //Param4
    sepPosition = inputString.indexOf(';');
    if(sepPosition != -1){
        param4=inputString.substring(0,sepPosition);                    
        inputString = inputString.substring(sepPosition+1, inputString.length());
    }
    else{  
      if(inputString.length() > 0)
          param4=inputString;  
    }
}