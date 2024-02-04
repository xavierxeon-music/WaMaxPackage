#

import matplotlib.pyplot as plt
import numpy as np

# https://numpy.org/doc/stable/reference/generated/numpy.polyfit.html
# https://stackoverflow.com/questions/30646152/python-matplotlib-pyqt-plot-to-qpixmap


class Plot:

   def __init__(self, data):

      self.data = data

   def startValue(self):

      valueList = self.data[:, :, 1, 0]
      valueList = np.transpose(valueList)
      print(self.data.shape, valueList.shape)

      fig, ax = plt.subplots()
      ax.pcolormesh(valueList)
      plt.show()
