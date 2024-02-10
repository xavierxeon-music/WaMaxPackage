#

from PySide6.QtCore import QObject, Signal, QSettings

from scipy.io import wavfile
import numpy as np

from .filter import lowpass
from .fit import fitAmplitude, amplitudeFunction, estimateParams


class WaveExport(QObject):

   exportProgress = Signal(int, int)

   def __init__(self, crawler):

      super().__init__()

      self.data = crawler.data

   def exportData(self, fileName):

      settings = QSettings()
      usePeak = settings.value('usePeak')

      from multiprocessing.pool import ThreadPool

      sampleCount = self.data.shape[3]
      if sampleCount > 128:
         sampleCount = 128
      samples = np.arange(sampleCount)

      wavdata = np.zeros((2, sampleCount * 360 * 180))

      counter = 0

      def _processAz(az):

         nonlocal counter

         for el in range(180):

            startIndex = (az + (el * 360))
            startIndex *= sampleCount
            endIndex = startIndex + sampleCount

            valuesLeft = self.data[az, el, 0, :]
            filterLeft = lowpass(valuesLeft)

            valuesRight = self.data[az, el, 1, :]
            filterRight = lowpass(valuesRight)

            if usePeak:
               estimateLeft = estimateParams(filterLeft)
               peakLeft = np.zeros(sampleCount)
               peakLeft[estimateLeft[2]] = estimateLeft[0]
               wavdata[0, startIndex:endIndex] = peakLeft

               estimateRight = estimateParams(filterRight)
               peakRight = np.zeros(sampleCount)
               peakRight[estimateRight[2]] = estimateRight[0]
               wavdata[1, startIndex:endIndex] = peakRight
            else:  # fit
               try:
                  paramLeft = fitAmplitude(filterLeft)
                  wavdata[0, startIndex:endIndex] = amplitudeFunction(samples, paramLeft[0], paramLeft[1], paramLeft[2], paramLeft[3])

                  paramRight = fitAmplitude(filterRight)
                  wavdata[1, startIndex:endIndex] = amplitudeFunction(samples, paramRight[0], paramRight[1], paramRight[2], paramRight[3])
               except RuntimeError:
                  print('error @ ', az, el)

         # print('AZ = ', counter, az)
         # self.exportProgress.emit(counter, 360)
         counter += 1

      self.exportProgress.emit(0, 360)

      with ThreadPool() as pool:
         for _ in pool.map(_processAz, range(360)):
            pass

      self.exportProgress.emit(360, 360)

      print('write to ', fileName, end=None)
      wavdata = np.transpose(wavdata)  # interleave
      wavfile.write(fileName, 48000, wavdata.astype(np.float32))
      print(' done')

      self.exportProgress.emit(0, 0)
