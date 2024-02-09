import colorsys


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

   def getState(self):

      return self.bridge.getState(self.deviceId)

   def swtich(self, on):

      payload = {"on": on}
      self.bridge.setState(self.deviceId, payload)

   def _compileHSL(self, hexColor):

      # sat (uint8)
      # hue (int16)
      # bri (uint8)

      red = int(hexColor[0:2], 16) / 255
      green = int(hexColor[2:4], 16) / 255
      blue = int(hexColor[4:6], 16) / 255

      [hue, sat, bright] = colorsys.rgb_to_hsv(red, green, blue)

      hue = int(hue * 65535)
      sat = int(sat * 255)
      bright = int(bright * 255)

      return [hue, sat, bright]

   def setColor(self, hexColor):

      [hue, sat, _] = self._compileHSL(hexColor)

      payload = {"hue": hue, "sat": sat, "transitiontime": 0, "alert": "none"}
      self.bridge.setState(self.deviceId, payload)

   def setColorBrightness(self, hexColor):

      [hue, sat, bright] = self._compileHSL(hexColor)

      payload = {"hue": hue, "sat": sat, "bri": bright, "transitiontime": 0, "alert": "none"}
      self.bridge.setState(self.deviceId, payload)

   def setBrightness(self, value):

      payload = {"bri": int(value), "transitiontime": 0, "alert": "none"}
      self.bridge.setState(self.deviceId, payload)

   def _transform(self, rgb):

      rgb = [self.correction.transform(rgb[0]), self.correction.transform(rgb[1]), self.correction.transform(rgb[2])]
      xyz = np.dot(self.matrix, rgb)

      sum = xyz[0] + xyz[1] + xyz[2]

      x = xyz[0] / sum
      y = xyz[1] / sum
      Y = xyz[1]

      return [x, y, Y]
