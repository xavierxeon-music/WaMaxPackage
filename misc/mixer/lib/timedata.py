#

import os
import pickle

from PySide6.QtCore import Qt

from .pixmap import Pixmap


class TimeData:

   def __init__(self, crawler):

      self.pixmaps = list()
      self.pixmaps.append(list())  # left
      self.pixmaps.append(list())  # right

      bufferName = 'data/' + crawler.name + '_TimeTexures.bin'

      if os.path.exists(bufferName):
         with open(bufferName, 'rb') as infile:
            self.pixmaps = pickle.load(infile)
      else:
         self._loadInternal(crawler.data, bufferName)

      for side in range(2):
         self.sampleCount = len(self.pixmaps[side])
         for index in range(self.sampleCount):
            pixmap = self.pixmaps[side][index]
            pixmap = pixmap.scaled(360 * Pixmap.scale, 180 * Pixmap.scale, Qt.IgnoreAspectRatio, Qt.SmoothTransformation)
            self.pixmaps[side][index] = pixmap

   def _loadInternal(self, data, bufferName):

      import matplotlib.pyplot as plt
      import numpy as np

      fileName = 'data/_tmp.png'
      sampleCount = int(data.shape[3])

      def _update(side, index):
         valueList = data[:, :, side, index]
         valueList = np.transpose(valueList)
         valueList = np.flipud(valueList)

         fig, ax = plt.subplots()
         plt.axis('off')
         ax.pcolormesh(valueList)
         plt.savefig(fileName, dpi=300, bbox_inches='tight', pad_inches=0)
         plt.close()

         pixmap = Pixmap()
         pixmap.load(fileName)
         self.pixmaps[side].append(pixmap)

      for index in range(sampleCount):
         _update(0, index)
         _update(1, index)
         print('buffer', index)

      with open(bufferName, 'wb') as outfile:
         pickle.dump(self.pixmaps, outfile)

      os.remove(fileName)
