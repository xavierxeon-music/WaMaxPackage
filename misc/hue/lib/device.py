#

import numpy as np

class Device:

   def __init__(self, bridge, deviceId):

      self.bridge = bridge
      self.deviceId = deviceId

   def isOn(self):

      state = self.bridge.getState(self.deviceId)

      on = state['on']
      if on:
         return 1
      else:
         return 0

   def turnOn(self):

      payload = {"on": True}
      self.bridge.setState(self.deviceId, payload)

   def turnOff(self):

      payload = {'on': False}
      self.bridge.setState(self.deviceId, payload)

   def setColor(self, color):

      # bri (uint8) for white light
      # sat (uint8)
      # xy [float, float]

      red = int(color[2:4], 16) / 255
      green = int(color[4:6], 16) / 255
      blue = int(color[6:8], 16) / 255

      rgb = [red, green, blue] 
      rgbToCIE = [[0.412453, 0.357580, 0.180423], [0.212671, 0.715160, 0.072169], [0.019334, 0.119193, 0.950227]]
      cie = np.dot(rgbToCIE, rgb)

      xy = [cie[0], cie[1]]
      sat = int(cie[2] * 255)

      payload = {"on": True, "xy": xy, "sat": sat}
      self.bridge.setState(self.deviceId, payload)

