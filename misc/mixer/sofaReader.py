#!/usr/bin/env python3

import math
import os
import wave

from multiprocessing.pool import ThreadPool
import pyfar as pf


data_ir, source_coordinates, _ = pf.io.read_sofa('NF150.sofa')
bufferMap = {}


def processAz(az):
   print(az)
   subBuffer = bytes()

   radius = 1.5
   azR = math.radians(az)

   for el in range(180):
      # el = el - 90
      elR = math.radians(el)
      x = radius * math.sin(azR) * math.cos(elR)
      y = radius * math.sin(azR) * math.sin(elR)
      z = radius * math.cos(azR)

      to_find = pf.Coordinates(x, y, z, domain='cart')
      index, _ = source_coordinates.find_nearest(to_find)

      signal = data_ir[index]
      signal.sampling_rate = int(signal.sampling_rate)

      fileName = f'{az}_{el}_ir.wav'
      pf.io.write_audio(signal, fileName)

      audio = wave.open(fileName, 'rb')
      channelCount = audio.getnchannels()
      sampleWidth = audio.getsampwidth()
      frameCount = audio.getnframes()
      data = audio.readframes(channelCount * sampleWidth * frameCount)
      audio.close()

      os.remove(fileName)
      subBuffer += data

      # print(az, el, channelCount, sampleWidth, frameCount)

   bufferMap[az] = subBuffer


def writeAudio():

   buffer = bytes()
   for az in range(360):
      buffer += bufferMap[az]

   audio = wave.open('../../media/mixerSpatialNF.wav', 'wb')
   audio.setnchannels(2)
   audio.setsampwidth(2)
   audio.setframerate(data_ir.sampling_rate)
   audio.writeframesraw(buffer)
   audio.close()


def main():
   with ThreadPool() as pool:
      for _ in pool.map(processAz, range(360)):
         pass

   writeAudio()


if __name__ == '__main__':
   main()
