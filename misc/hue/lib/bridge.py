#

import json
import os
import requests
import sys

from pathlib import Path

from .device import Device


class Bridge:

   def __init__(self):

      settingsFileName = str(Path.home()) + '/.hue.json'
      if not os.path.exists(settingsFileName):
         settings = self.compileCredentials()
         with open(settingsFileName, 'w') as outfile:
            json.dump(settings, outfile, indent=3)
      else:
         with open(settingsFileName, 'r') as infile:
            settings = json.load(infile)

      self.baseUrl = f"http://{settings['bridge']}/api/{settings['username']}/"

      self.baseUrl2 = f'http://{settings["bridge"]}/clip/v2/resource/'
      self.header = {'hue-application-key': settings["username"]}

      self.devices = dict()
      lights = requests.get(self.baseUrl + 'lights').json()
      for key, device in lights.items():
         name = device['name']
         self.devices[name] = key

         # print(key, name, device['type'])

   def compileCredentialsV2(self):

      location = requests.get('https://discovery.meethue.com').json()
      location = location[0]  # can be several bridges
      ip = location['internalipaddress']

      settings = {'bridge': ip, 'devicetype': 'odense_hue'}
      print('bridge @', ip)

      keyUrl = f'http://{ip}/api'
      keyRequest = {'devicetype': 'odense_hue', 'generateclientkey': True}

      data = requests.post(keyUrl, json=keyRequest).json()
      data = data[0]

      if 'error' in data:
         description = data['error']['description']
         print(description)
         sys.exit()
      elif 'success' in data:
         settings['username'] = data['success']['username']
         settings['clientkey'] = data['success']['clientkey']

      return settings

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
      # print(deviceId, payload, response.text)
