EventfulHome
============

Small node.js solution for creating a "smart home" based on event driven architecture.

Work in progress:
Separating "scenes" to config files to create more generic services
Creating architecture overview picture


Mobile client (EventfulHomeRemote) design info here: 
https://www.lucidchart.com/documents/view/4619-4718-528cac41-9187-128d0a004b21


Raspberry-pi-insperation: 
http://www.makeuseof.com/tag/how-to-build-home-automation-system-raspberry-pi-and-arduino/


Dashboard (/widget) (client) insperation: 
http://ni-c.github.io/heimcontrol.js/plugins/arduino.html
https://www.google.se/search?q=dashboard&rlz=1C1_____enSE544SE544&espv=210&es_sm=93&tbm=isch&tbo=u&source=univ&sa=X&ei=i4iLUrTeN6nJ4gT2oYHQAg&ved=0CF4QsAQ&biw=1680&bih=906#facrc=_&imgdii=_&imgrc=jwwIwbMbkmunvM%3A%3BhaIqcU9ArvpPaM%3Bhttp%253A%252F%252Fwww.thesearchagents.com%252Fwp-content%252Fuploads%252F2012%252F04%252Fmobile-dashboard.jpg%3Bhttp%253A%252F%252Fwww.thesearchagents.com%252F2012%252F04%252Fhow-to-create-a-mobile-marketing-dashboard-in-google-analytics%252F%3B1246%3B757
communication between client and node-services http://java.dzone.com/articles/getting-started-socketio-and


nodejs to arduino-communication 
try to use json for two way communication
https://github.com/voodootikigod/node-serialport - use this package to communicate with arduino 
Would it be possible to have two-way communication done in JSON (https://github.com/interactive-matter/aJson)
basic example https://gist.github.com/reid/1544666
http://stackoverflow.com/questions/15028240/raspberry-pi-arduino-node-js-and-serial-port
http://www.barryvandam.com/node-js-communicating-with-arduino/
http://www.makeuseof.com/tag/how-to-build-home-automation-system-raspberry-pi-and-arduino/
http://danieldvork.in/arduino-controlled-html5-etch-a-sketch-using-node-js-and-websockets/
http://ni-c.github.io/heimcontrol.js/
http://www.barryvandam.com/arduino/node-js-communicating-with-arduino/ 


IR-codes
clone difficult ir-codes: http://www.richardosgood.com/blog/2013/11/12/clone-infrared-signals-with-arduino/
http://translate.google.se/translate?hl=en&sl=ru&u=http://www.marsohod.org/index.php/projects/plata1/144-smarth&prev=/search%3Fq%3DE0E0B44B%2Bsamsung
http://www.righto.com/2009/08/multi-protocol-infrared-remote-library.html
http://code.google.com/p/studioimaginaire/source/browse/arduino_remote/samsung_un40c5000_ircodes.txt?r=618334232f9d70e2aceef745262e501cac4c6941
https://github.com/targettio/Arduino-IR-remote
http://www.righto.com/2009/08/multi-protocol-infrared-remote-library.html
http://jerrylparker.com/?p=94
http://blog.lucaseckels.com/2009/05/04/really-simple-arduino-ir-receiver/
database with IR-codes: http://irdb.tk/

Control Yamaha receiver - use http-api
insperation from https://github.com/BirdAPI/RX-V867-EventGhost-Plugin/blob/master/rxv867.py




Ideas for future services
433-service - use RC Switch to control lights instead of tellstick?
http://sebastiannilsson.com/projekt/arduino/433-mhz-rf-nexa-saendare-och-mottagare-med-arduino/
http://www.telldus.com/forum/viewtopic.php?f=12&t=4072
http://www.androiderode.com/how-to-test-433-mhz-rf-receiver/
https://blog.codecentric.de/en/2013/03/home-automation-with-angularjs-and-node-js-on-a-raspberry-pi/

skype-cam on tv? - use IR?

CEC-control 
http://www.raspberrypi.org/phpBB3/viewtopic.php?t=15749&p=199318 http://blog.endpoint.com/2012/11/using-cec-client-to-control-hdmi-devices.html
http://www.raspberrypi.org/phpBB3/viewtopic.php?f=35&t=15593&p=158409&hilit=cec_client#p158409
https://github.com/Pulse-Eight/libcec

connect to XMPP-protocol?
https://github.com/EnerNOC/remoht.us
http://robobrrd.com/learn/googleplus/
http://simonholywell.com/post/2013/02/create-a-node-js-google-talk-bot-pt1.html
https://github.com/node-xmpp/node-xmpp/blob/master/examples/send_message.js
https://github.com/mitchtech/raspi_gtalk_robot/blob/master/raspiBot.py
http://oskarhane.com/make-your-raspberry-pis-and-other-servers-a-botnet-controlled-via-xmpp/ 
http://www.nimbits.com/pages/xmpp.html 

Access outside local network? 
http://progrium.com/localtunnel/ 

RGB-Led-lights through arduino
http://blog.tkjelectronics.dk/2013/01/bluetooth-controlled-rgb-light-strip/#more-3870

online-charts?
http://learn.adafruit.com/assets/1370
https://www.carriots.com/
http://juliencoquet.com/en/2013/04/08/measuring-offline-store-activity-with-google-universal-analytics/#more-1723

sleep monitor service
http://blog.datasingularity.com/?p=700





Other projects for insperation and useful links
https://sites.google.com/site/gdevelopercodelabs/app-engine/java-codelab
https://bitbucket.org/davka003/automagically
http://blog.rueedlinger.ch/2013/03/raspberry-pi-and-nodejs-basic-setup/ 
http://www.everymote.com/#/things
