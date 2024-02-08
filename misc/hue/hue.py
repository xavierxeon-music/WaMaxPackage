#!/usr/bin/env python3

import sys

from lib import Bridge


def main():

   if len(sys.argv) > 1:
      command = sys.argv[1]
   else:
      command = None

   if len(sys.argv) > 2:
      name = sys.argv[2]
   else:
      name = None

   bridge = Bridge()
   device = bridge.getDeviceId(name)

   try:
      match command:
         case None:
            print('coammnd error')
            sys.exit(1)
         case 'state':
            state = device.isOn()
            print('state', state)
         case 'on':
            device.turnOn()
         case 'off':
            device.turnOff()
         case 'list':
            bridge.listDevices()
         case _:
            if command.startswith('0x'):
               device.setColor(command)
            else:
               print('coammnd error')
               sys.exit(1)
   except AttributeError:
      print('dervice error')
      sys.exit(1)


if __name__ == '__main__':
   main()
