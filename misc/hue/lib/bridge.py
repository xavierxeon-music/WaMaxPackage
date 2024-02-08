#

import json
import requests

from pathlib import Path

from .device import Device


class Bridge:

   def __init__(self):

      settingsFileName = str(Path.home()) + '/.hue.json'
      with open(settingsFileName, 'r') as infile:
         settings = json.load(infile)

      self.baseUrl = f"http://{settings['bridge']}/api/{settings['username']}/"

      self.devices = dict()
      lights = requests.get(self.baseUrl + 'lights').json()
      for key, device in lights.items():
         name = device['name']
         self.devices[name] = key

         # print(key, name, device['type'])

   def listDevices(self):

      nameList = list(self.devices.keys())
      print(nameList)

   def getDeviceId(self, name):

      if not name in self.devices:
         return None
      else:
         deviceId = self.devices[name]
         device = Device(self, deviceId)
         return device

   def getState(self, deviceId):

      data = requests.get(self.baseUrl + 'lights/' + deviceId).json()
      return data['state']

   def setState(self, deviceId, payload):

      response = requests.put(self.baseUrl + 'lights/' + deviceId + '/state', json=payload)
      # print(response.text)
