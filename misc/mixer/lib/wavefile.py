#

import os

import pyfar as pf
import wave

from .crawler import Crawler


class WaveFile(Crawler):

   def __init__(self, fileName):

      super().__init__(fileName)

      self.samplingRate = 0

      bufferMap = dict()
      for az in range(360):
         bufferMap[az] = bytes()

      def _process(signal, az, el):

         signal.sampling_rate = int(signal.sampling_rate)

         # write to file
         fileName = f'data/{az}_{el}_ir.wav'
         pf.io.write_audio(signal, fileName)

         # read file and extract audio data
         audio = wave.open(fileName, 'rb')
         channelCount = audio.getnchannels()
         sampleWidth = audio.getsampwidth()
         frameCount = audio.getnframes()
         data = audio.readframes(channelCount * sampleWidth * frameCount)
         audio.close()

         os.remove(fileName)
         bufferMap[az] += data

         self.samplingRate = signal.sampling_rate

      self.execute(_process)

      self.buffer = bytes()
      for az in range(360):
         self.buffer += bufferMap[az]

   def write(self):

      audio = wave.open('../../media/mixerSpatial_' + self.name + '.wav', 'wb')
      audio.setnchannels(2)
      audio.setsampwidth(2)
      audio.setframerate(self.samplingRate)
      audio.writeframesraw(self.buffer)
      audio.close()
