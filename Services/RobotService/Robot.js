//Button events
//Control lights
//Control arms, head, eyes
//Say - Text to speech
//PlaySound
//Disco

var five = require("johnny-five"),
  Player = require('player'),
  board,
  player,
  arduinoready=false,
  quiettime=true,
  matrixon=true; //Set to true to avoid triggering events and playing sounds

var config = require('./serviceconfig.json');

//exports.initializeService = function(client) {    
  
  board = new five.Board();

  board.on("ready", function() {
    arduinoready=true;   //disconnect event?!





    //Upper Left 
    // Song board
    //Red buttons (22-28)
    var button1 = new five.Button(22).on("down", function() { playSound("song1"); }).on("up", function() { console.log("up22"); });
    var button2 = new five.Button(23).on("down", function() { playSound("song2"); }).on("up", function() { console.log("up23"); });
    var button3 = new five.Button(24).on("down", function() { playSound("song3"); }).on("up", function() { console.log("up24"); });
    var button4 = new five.Button(25).on("down", function() { playSound("song4"); }).on("up", function() { console.log("up25"); });
    var button5 = new five.Button(26).on("down", function() { playSound("song5"); }).on("up", function() { console.log("up26"); });
    var button6 = new five.Button(27).on("down", function() { playSound("song6"); }).on("up", function() { console.log("up27"); });
    var button7 = new five.Button(28).on("down", function() { playSound("song7"); }).on("up", function() { console.log("up28"); });

    //yellow potentiometer (A0)
    var potentiometer0= new five.Sensor({ pin: "A0", freq: 250, threshold: 10 }).scale([1, 100]).on("change", function() { console.log("A0:",this.value, this.raw); });
    
    //green buttons (29-33)
    var button8 = new five.Button(29).on("down", function() { playSound("song8"); }).on("up", function() { console.log("up29"); });
    var button9 = new five.Button(30).on("down", function() { playSound("song9"); }).on("up", function() { console.log("up30"); });
    var button10 = new five.Button(31).on("down", function() { playSound("song10"); }).on("up", function() { console.log("up31"); });
    var button11 = new five.Button(32).on("down", function() { playSound("song11"); }).on("up", function() { console.log("up32"); });
    var button12 = new five.Button(33).on("down", function() { playSound("song12"); }).on("up", function() { console.log("up33"); });

    //pir (2) 
    // todo: control if playback should continue ??
    var motion = new five.IR.Motion(2).on("motionstart", function(err, ts) { console.log("motionstart", ts); }).on("motionend", function(err, ts) { console.log("motionend", ts); });






    //Upper Right 
    // Animation board
    //power switch (34)
    //Controls if matrix is shown
    var B2Switch1 = new five.Switch(34).on("open", function() { matrixon=false; }).on("close", function() { matrixon=true; });
    
    //pullout switch (46)
    //Todo: Controls heart beat sound ??
    var B2Switch2 = new five.Switch(46).on("open", function() { console.log("open46"); }).on("close", function() { console.log("close46"); });
    
    //knob pot with red marker (A2-3)  
    //First knob controls speed
    var B2Pot1= new five.Sensor({ pin: "A1", freq: 250, threshold: 10 }).scale([1, 100]).on("change", function() { console.log("A1:",this.value, this.raw); });
    //Todo: Second knob controls pictures
    var B2Pot2= new five.Sensor({ pin: "A2", freq: 250, threshold: 10 }).scale([1, 100]).on("change", function() { console.log("A2:",this.value, this.raw); });
    
    //led matrix (3-5)
    var ledmatrix = new five.LedControl({
      pins: {
        data: 5,
        clock: 3,
        cs: 4
      },
      isMatrix: true
    });

    //Todo: move to config and allow for multiple "pictures" in an animation
    var heartbig = [
      "01100110",
      "10011001",
      "10000001",
      "10000001",
      "01000010",
      "00100100",
      "00011000",
      "00000000"
    ];

    var heartsmall = [
      "00000000",
      "00100100",
      "01011010",
      "01000010",
      "00100100",
      "00011000",
      "00000000",
      "00000000"
    ];

    ledmatrix.brightness(10);
    ledmatrix.on();

    /*var msg = "AXEL*".split("");
    var c;
    if (c = msg.shift()) {
      ledmatrix.draw(c);
      setTimeout(next, 500);
    }*/

    var tHeart=false;
    function drawMatrix(){
      tHeart= !tHeart;
      if (!quiettime && matrixon)
        ledmatrix.draw((tHeart)?heartbig:heartsmall);

      setTimeout(drawMatrix, potentiometer1.scale([300, 2000]).value);
    }
    setTimeout(drawMatrix, 500);





    //Lower left
    //Sound board - different sound on open/close

    //power switch (35)
    var B3switch1 = new five.Switch(35).on("open", function() { playSound("soundeffect1"); }).on("close", function() { playSound("soundeffect2"); });
    
    // red trigger switches (39-40)
    var B3switch2 = new five.Switch(39).on("open", function() { playSound("soundeffect3"); }).on("close", function() { playSound("soundeffect4"); });
    var B3switch3 = new five.Switch(40).on("open", function() { playSound("soundeffect5"); }).on("close", function() { playSound("soundeffect6"); });
    
    // black switches under red trigger buttons (37-38) 
    var B3switch4 = new five.Switch(37).on("open", function() { playSound("soundeffect7"); }).on("close", function() { playSound("soundeffect8"); });
    var B3switch5 = new five.Switch(38).on("open", function() { playSound("soundeffect9"); }).on("close", function() { playSound("soundeffect10"); });
    
    // small metal switches (41-42)
    var B3switch6 = new five.Switch(41).on("open", function() { playSound("soundeffect11"); }).on("close", function() { playSound("soundeffect12"); });
    var B3switch7 = new five.Switch(42).on("open", function() { playSound("soundeffect13"); }).on("close", function() { playSound("soundeffect14"); });
    





    //Lower Right
    // Party board 
    // big green button starts party song/drum solo. Green light solid on while "sleep" - pulse while partymusic
    // Red buttons switch prev/next partysong
    // joystick - party sounds on "outer limits"
    // 
    //Power button (36)
    //Todo: control external disco-lights
    var B4switch1 = new five.Switch(36).on("open", function() { console.log("open36"); }).on("close", function() { console.log("close36"); });

    //Small red buttons (43-44)
    //Select prev/next party song. Hold controls quiet time (left=quiet, right=non quiet)
    var B4button1 = new five.Button(43).on("down", function() { 
      try{
        player.prev();
      }catch(e){
        console.log("error",e);
      }
    }).on("hold", function(){
      setQuiet();
    }).on("up", function() { console.log("up43"); });
    var B4button2 = new five.Button(44).on("down", function() { 
      try{
        player.next();
      }catch(e){
        console.log("error",e);
      }
    }).on("hold", function(){
      setNonQuiet();
    }).on("up", function() { console.log("up44"); });
    
    //gamepad (6, A3-4)
    //not working - var button = new five.Button(6).on("down", function() { console.log("gamepad down"); }).on("up", function() { console.log("gamepad up"); }); 
    //Right-left and Up-down 
    var B4joyy= new five.Sensor({ pin: "A3", freq: 250, threshold: 10 }).scale([1, 100]).on("change", function() { console.log("A3:",this.value, this.raw); });
    var B4joyx= new five.Sensor({ pin: "A4", freq: 250, threshold: 10 }).scale([1, 100]).on("change", function() { console.log("A4:",this.value, this.raw); });
    
    //Big green button (45)
    var B4button3 = new five.Button(45).on("down", function() 
    { 
      
      // play now and callback when playend
      playSound("party");
      player.on("playend",function(){
        greenled.off();
      });
      greenled.pulse();


    }).on("up", function() { console.log("up45"); });
      
    //green led (13)
    var B4greenled=new five.Led(13);
    greenled.off();
    



    //Whole board has been initialized - wait for a few seconds before allowing events and sounds
    setTimeout(setNonQuiet, 2000);

    //Utility functions

    function setQuiet(){
      quiettime=true;
      ledmatrix.off();
      try{
        player.stop();
      }catch(e)
      {
        console.log("error",e);
      }
      B4greenled.on(); //somehow this has been inverted
    }

    function setNonQuiet(){
      quiettime=false;
      ledmatrix.on();
      B4greenled.off(); //somehow this has been inverted
    }

    function playSound(itemtitle){
      if (!quiettime){
        config.sounds.forEach(function(item) {
          if (item.title==itemtitle){
            try{
              player.stop();
              player = new Player(item.filepaths);
              player.play();
            }catch (e){
              console.log("error",e);
            }          
          }
        };
      }
    }

  });

//});