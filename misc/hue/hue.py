#!/usr/bin/env python3

import json
import requests

from pathlib import Path


settingsFileName = str(Path.home()) + '/.hue.json'
with open(settingsFileName, 'r') as infile:
   settings = json.load(infile)

baseUrl = f"http://{settings['bridge']}/api/{settings['username']}/"

light = requests.get(baseUrl + 'lights/1').json()
with open(str(Path.home()) + '/tmp/debug.json', 'w') as outfile:
   json.dump(light, outfile, indent=3)

state = light['state']
print(state)

onOff = state['on']
if onOff:
   payload = {'on': False}
else:
   payload = {"on": True}

print(payload)

response = requests.put(baseUrl + 'lights/1/state', json=payload)
print(response.text)
