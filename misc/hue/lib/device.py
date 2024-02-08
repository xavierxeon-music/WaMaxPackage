#

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
      print('set color', color)
