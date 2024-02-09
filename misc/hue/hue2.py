#!/usr/bin/env python3


import json
import os
import requests
import sys

from pathlib import Path


class Bridge:

   def __init__(self):

      settingsFileName = str(Path.home()) + '/.hue_v2.json'
      if not os.path.exists(settingsFileName):
         settings = self.getCredentials(settingsFileName)
         with open(settingsFileName, 'w') as outfile:
            json.dump(settings, outfile, indent=3)
      else:
         with open(settingsFileName, 'r') as infile:
            settings = json.load(infile)

      self.baseUrl = f'http://{settings["bridge"]}/clip/v2/resource/'
      self.header = {'hue-application-key': settings["username"]}

   def getCredentials(self):

      location = requests.get('https://discovery.meethue.com').json()
      location = location[0]  # can be several bridges
      ip = location['internalipaddress']

      settings = {'bridge': ip, 'devicetype': 'odense_hue'}
      print(ip)

      keyUrl = f'http://{ip}/api'
      keyRequest = {'devicetype': 'odense_hue', 'generateclientkey': True}
      print(keyUrl, keyRequest)
      data = requests.post(keyUrl, json=keyRequest).json()
      data = data[0]
      print(data)
      if 'error' in data:
         description = data['error']['description']
         print(description)
         sys.exit()
      elif 'success' in data:
         settings['username'] = data['success']['username']
         settings['clientkey'] = data['success']['clientkey']

      return settings


def main():

   bridge = Bridge()
   return

   print(bridge.baseUrl + 'device')
   print(bridge.header)

   # data = requests.get(bridge.baseUrl + 'device', headers=bridge.header).json()
   data = requests.get(bridge.baseUrl + 'device', headers=bridge.header)
   print(data)


if __name__ == '__main__':

   main()
