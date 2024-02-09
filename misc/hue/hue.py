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

   commandMap = {'list': [bridge.listDevices, None, 'list devices']}
   commandMap['state'] = [device.isOn if device else None, None, 'check id device is on or off']
   commandMap['on'] = [device.swtich if device else None, True, 'turn device on']
   commandMap['off'] = [device.swtich if device else None, False, 'turn device off']
   commandMap['color'] = [device.setColor if device else None, parameter, 'set color, ignore brightness']
   commandMap['bright'] = [device.setBrightness if device else None, parameter, 'set brightness']
   commandMap['colorbright'] = [device.setColorBrightness if device else None, parameter, 'set color and brightness']

   if not command in commandMap:
      print('command error')
      for name, item in commandMap.items():
         help = item[2]
         print(name, ': ', help)
      sys.exit(1)
   else:
      function = commandMap[command][0]
      if not function:
         print('dervice error')
         sys.exit(1)
      fp = commandMap[command][1]
      if None == fp:
         function()
      else:
         function(fp)


if __name__ == '__main__':
   main()
