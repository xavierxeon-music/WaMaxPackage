#!/usr/bin/env python3

import sys

from lib import Bridge


def main():

   if len(sys.argv) == 1:
      print('command error')
      sys.exit(1)

   command = sys.argv[1]

   if len(sys.argv) > 2:
      deviceName = sys.argv[2]
   else:
      deviceName = None

   if len(sys.argv) > 3:
      parameter = sys.argv[3]
   else:
      parameter = None

   bridge = Bridge()
   device = bridge.getDeviceId(deviceName)

   try:
      match command:
         case None:
            print('command error')
            sys.exit(1)
         case 'state':
            state = device.isOn()
            print('state', state)
         case 'on':
            device.turnOn()
         case 'off':
            device.turnOff()
         case 'list':
            if not device:
               bridge.listDevices()
            else:
               state = device.getState()
               print(state)
         case 'color':
            device.setColor(parameter)
         case 'bright':
            device.setBrightness(parameter)
         case _:
            print('command error')
            sys.exit(1)

   except AttributeError:
      print('dervice error')
      sys.exit(1)


if __name__ == '__main__':
   main()
