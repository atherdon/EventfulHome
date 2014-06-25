#!/bin/bash
export PATH=$PATH:/home/pi/node-v0.10.26-linux-arm-pi/bin
export NODE_PATH=$NODE_PATH:/home/pi/node-v0.10.26-linux-arm-pi/lib/node_modules
export HOME=/home/pi
export EHSERVER=192.168.1.5
export EHPORT=16005

case "$1" in
  start)
    exec nodemon -i $HOME/EventfulHome/.git/ -i $HOME/EventfulHome/node_modules/ -i $HOME/EventfulHome/Services/EventfulHomeRemoteServerService/resourcecache/ -w $HOME/EventfulHome/ -e js,json -d 10 $HOME/EventfulHome/ServiceHost.js -s $EHSERVER -p $EHPORT >> $HOME/nodejs.log 2>&1 &
    ;;
  stop)
    exec killall node
    ;;
  *)

  echo "Usage: /etc/init.d/nodejs.sh {start|stop}"
  exit 1
  ;;
esac
exit 0
