#

from PySide6.QtCore import QObject, Signal

from scipy.io import wavfile
import numpy as np

from .filter import lowpass
from .fit import fitAmplitude, amplitudeFunction


class WaveExport(QObject):

   def __init__(self, crawler):

      super().__init__()

      self.data = crawler.data

   def exportData(self, fileName):

      from multiprocessing.pool import ThreadPool

      sampleCount = self.data.shape[3]
      if sampleCount > 128:
         sampleCount = 128
      samples = np.arange(sampleCount)

      wavdata = np.zeros((2, sampleCount * 360 * 180))

      def _processAz(az):

         for el in range(180):

            startIndex = (az + (el * 360))
            startIndex *= sampleCount
            endIndex = startIndex + sampleCount
            try:
               valuesLeft = self.data[az, el, 0, :]
               filterLeft = lowpass(valuesLeft)
               paramLeft = fitAmplitude(filterLeft)
               wavdata[0, startIndex:endIndex] = amplitudeFunction(samples, paramLeft[0], paramLeft[1], paramLeft[2], paramLeft[3])

               valuesRight = self.data[az, el, 1, :]
               filterRight = lowpass(valuesRight)
               paramRight = fitAmplitude(filterRight)
               wavdata[1, startIndex:endIndex] = amplitudeFunction(samples, paramRight[0], paramRight[1], paramRight[2], paramRight[3])

            except RuntimeError:
               print('error @ ', az, el)

         print('AZ = ', az)

      with ThreadPool() as pool:
         for _ in pool.map(_processAz, range(360)):
            pass

      print('write to ', fileName, end=None)
      wavdata = np.transpose(wavdata)  # interleave
      wavfile.write(fileName, 48000, wavdata.astype(np.float32))
      print(' done')
