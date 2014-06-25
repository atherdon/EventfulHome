#!/bin/bash
cd
sudo rm -rf /usr/local/{lib/node{,/.npm,_modules},bin,share/man}/npm*
sudo rm /opt/node/bin/node
sudo rm /usr/bin/node
sudo rm /usr/bin/npm
sudo rm -rf /opt/node/
sudo rm /usr/lib/node
sudo rm /usr/local/bin/node

wget http://nodejs.org/dist/v0.10.26/node-v0.10.26-linux-arm-pi.tar.gz
tar -xvzf node-v0.10.26-linux-arm-pi.tar.gz
sudo cp EventfulHome/misc/PiInstallation/nodejs.sh /etc/init.d/nodejs.sh
cp EventfulHome/misc/PiInstallation/.bash_profile .
. ~/.bash_profile
npm install -g node-gyp nodemon
cp EventfulHome/Services/GitPullService/serviceconfig.json.example EventfulHome/Services/GitPullService/serviceconfig.json
ln -s EventfulHome/Services/GitPullService/GitPull.js EventfulHome/Services/GitPullService/service.js
tail -f nodejs.log &
cd EventfulHome/
npm install serialport stdio faye 
sudo /etc/init.d/nodejs.sh start  
