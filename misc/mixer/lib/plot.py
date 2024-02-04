#

import matplotlib.pyplot as plt
import numpy as np

# https://numpy.org/doc/stable/reference/generated/numpy.polyfit.html


class Plot:

   def __init__(self, data):

      self.data = data

   def startValue(self):

      valueList = self.data[:, :, 0, 0]
      print(self.data.shape, valueList.shape)

      fig, ax = plt.subplots()
      ax.pcolormesh(valueList)
      plt.show()
