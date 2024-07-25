#

import itertools
import math
import wave


class Wave:

   def __init__(self, data):

      self.data = data

   def write(self, fileName, fftSize=1024, minWaveLength=380, maxWaveLength=750):

      if minWaveLength < self.data.minLength:
         minWaveLength = self.data.minLength
      if maxWaveLength > self.data.maxLength:
         maxWaveLength = self.data.maxLength

      halfSize = int(fftSize / 2)
      waveDelta = int(maxWaveLength - minWaveLength)
      r = list()
      g = list()
      b = list()
      for index in range(halfSize):
         w = maxWaveLength - int(index * waveDelta / halfSize)
         w = w - self.data.minLength
         data = self.data[w]

         # print(index, w, data)
         r.append(round(255 * data.red))
         g.append(round(255 * data.green))
         b.append(round(255 * data.blue))

      rgb = itertools.chain(*zip(r, g, b))

      with wave.open(fileName, mode="wb") as wav_file:
         wav_file.setnchannels(3)
         wav_file.setsampwidth(1)
         wav_file.setframerate(44800)
         wav_file.writeframes(bytes(rgb))
