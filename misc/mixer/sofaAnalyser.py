#!/usr/bin/env python3

from lib import Select

import math
import os
import pickle

import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

# https://pyfar.readthedocs.io/en/latest/concepts/pyfar.coordinates.html
# https://pyfar.readthedocs.io/en/latest/classes/pyfar.coordinates.html#pyfar.classes.coordinates.Coordinates


class Data:

   def __init__(self, fileName):

      self.leftBuffer = list()
      self.rightBuffer = list()

      self._loadInternal(fileName)
      self.sampleCount = int(len(self.leftBuffer) / (360 * 180))

   def index(self, az, el):

      return (az * self.sampleCount) + el

   def _loadInternal(self, fileName):

      name = Path(fileName).name.replace(Path(fileName).suffix, '')
      leftBufferName = 'data/' + name + '_LeftBuffer.bin'
      rightBufferName = 'data/' + name + '_RightBuffer.bin'

      if os.path.exists(leftBufferName) and os.path.exists(rightBufferName):
         with open(leftBufferName, 'rb') as infile:
            self.leftBuffer = pickle.load(infile)
         with open(rightBufferName, 'rb') as infile:
            self.rightBuffer = pickle.load(infile)
         return

      from multiprocessing.pool import ThreadPool
      import pyfar as pf

      data_ir, source_coordinates, _ = pf.io.read_sofa(fileName)
      bufferMapLeft = dict()
      bufferMapRight = dict()

      def _processAz(az):

         print(az)

         subBufferLeft = list()
         subBufferRight = list()

         radius = 1.5
         azR = math.radians(az)

         for el in range(180):
            # el = el - 90
            elR = math.radians(el)
            x = radius * math.sin(azR) * math.cos(elR)
            y = radius * math.sin(azR) * math.sin(elR)
            z = radius * math.cos(azR)

            to_find = pf.Coordinates(x, y, z, domain='cart')
            index, _ = source_coordinates.find_nearest(to_find)
            signal = data_ir[index]

            leftData = signal[0].time.tolist()[0]
            subBufferLeft += leftData

            rightData = signal[1].time.tolist()[0]
            subBufferRight += rightData

         bufferMapLeft[az] = subBufferLeft
         bufferMapRight[az] = subBufferRight

      with ThreadPool() as pool:
         for _ in pool.map(_processAz, range(360)):
            pass

      for az in range(360):
         self.leftBuffer += bufferMapLeft[az]
         self.rightBuffer += bufferMapRight[az]

      with open(leftBufferName, 'wb') as outfile:
         pickle.dump(self.leftBuffer, outfile)
      with open(rightBufferName, 'wb') as outfile:
         pickle.dump(self.rightBuffer, outfile)


def main():

   fileName = Select.fileName()
   data = Data(fileName)

   # print(len(data.leftBuffer), sampleCount)

   azList = list()
   elList = list()
   valueList = np.zeros((180, 360))

   for az in range(360):
      azList.append(az)
      for el in range(180):
         if 0 == az:
            elList.append(el)
         index = data.index(az, el)
         value = data.leftBuffer[index + 0]
         valueList[el, az] = value

   # print(len(azList), len(elList), len(valueList), len(azList) * len(elList))

   fig, ax = plt.subplots()
   ax.pcolormesh(azList, elList, valueList)
   plt.show()


if __name__ == '__main__':
   main()
