#

import numpy as np
import os
import pickle

from ._crawler import Crawler


class PlotCrawler(Crawler):

   def __init__(self, fileName):

      super().__init__(fileName)

      self.data = np.zeros((360, 180, 2, 1))
      self._loadInternal()

   def _loadInternal(self):

      bufferName = 'data/' + self.name + '_Buffer.bin'

      if os.path.exists(bufferName):
         with open(bufferName, 'rb') as infile:
            self.data = pickle.load(infile)
         return

      def _sofaDataFunction(data_ir):
         self.data = np.zeros((180, 360, 2, data_ir.n_samples))

      def _process(signal, az, el):

         self.data[el, az, 0] = signal[0].time
         self.data[el, az, 1] = signal[1].time

      self.execute(_process, None, _sofaDataFunction)

      with open(bufferName, 'wb') as outfile:
         pickle.dump(self.data, outfile)
