#

import matplotlib.pyplot as plt
import numpy as np


class Plot:

   def __init__(self, data):
      self.data = data

   def startValue(self):

      azList = list()
      elList = list()
      valueList = np.zeros((180, 360))

      for az in range(360):
         azList.append(az)
         for el in range(180):
            if 0 == az:
               elList.append(el)
            index = self.data.index(az, el)
            value = self.data.leftBuffer[index + 0]
            valueList[el, az] = value

      # print(len(azList), len(elList), len(valueList), len(azList) * len(elList))

      fig, ax = plt.subplots()
      ax.pcolormesh(azList, elList, valueList)
      plt.show()
