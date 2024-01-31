#


import os
import pickle


from lib import Crawler


class PlotData(Crawler):

   def __init__(self, fileName):

      super().__init__(fileName)

      self.leftBuffer = list()
      self.rightBuffer = list()

      self._loadInternal(fileName)
      self.sampleCount = int(len(self.leftBuffer) / (360 * 180))

   def index(self, az, el):

      return (az * self.sampleCount) + el

   def _loadInternal(self, fileName):

      leftBufferName = 'data/' + self.name + '_LeftBuffer.bin'
      rightBufferName = 'data/' + self.name + '_RightBuffer.bin'

      if os.path.exists(leftBufferName) and os.path.exists(rightBufferName):
         with open(leftBufferName, 'rb') as infile:
            self.leftBuffer = pickle.load(infile)
         with open(rightBufferName, 'rb') as infile:
            self.rightBuffer = pickle.load(infile)
         return

      bufferMapLeft = dict()
      bufferMapRight = dict()

      for az in range(360):
         bufferMapLeft[az] = list()
         bufferMapRight[az] = list()

      def _process(signal, az, el):

         leftData = signal[0].time.tolist()[0]
         bufferMapLeft[az] += leftData

         rightData = signal[1].time.tolist()[0]
         bufferMapRight[az] += rightData

      def _endSection(az):

         print('process', az)

      self.execute(_process, _endSection)

      for az in range(360):
         self.leftBuffer += bufferMapLeft[az]
         self.rightBuffer += bufferMapRight[az]

      with open(leftBufferName, 'wb') as outfile:
         pickle.dump(self.leftBuffer, outfile)
      with open(rightBufferName, 'wb') as outfile:
         pickle.dump(self.rightBuffer, outfile)
