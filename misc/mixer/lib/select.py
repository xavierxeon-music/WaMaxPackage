#

import json
import os
import requests
import sys


class Select:

   @staticmethod
   def fileName():

      with open('files.json', 'r') as infile:
         data = json.load(infile)

      Select._maybeDownload(data)

      keyList = list(data.keys())
      index = None

      if len(sys.argv) > 1:
         try:
            index = int(sys.argv[1]) - 1
         except ValueError:
            print('invalid selection')
            sys.exit(1)

      if index == None:
         for selectIndex, key in enumerate(keyList):
            print(selectIndex + 1, key)

         ans = input("Select number: ")
         try:
            index = int(ans) - 1
         except ValueError:
            print('invalid selection')
            sys.exit(1)

      if index < 0 or index >= len(keyList):
         print('selection out of range')
         sys.exit(1)

      fileName = os.getcwd() + '/data/' + keyList[index] + '.sofa'
      return fileName

   @staticmethod
   def _maybeDownload(data):

      for key, url in data.items():
         fileName = os.getcwd() + '/data/' + key + '.sofa'
         if os.path.exists(fileName):
            continue
         print('DOWNLAOD', key)
         dataFile = requests.get(url)
         with open(fileName, 'wb') as output:
            output.write(dataFile.content)
