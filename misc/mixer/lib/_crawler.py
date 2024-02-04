#

import math
from pathlib import Path


class Crawler:

   def __init__(self, fileName):

      self.fileName = fileName
      self.name = Path(fileName).name.replace(Path(fileName).suffix, '')

      print(self.name)

   def execute(self, processFunction, endSectionFunction=None, sofaDataFunction=None):

      from multiprocessing.pool import ThreadPool
      import pyfar as pf

      data_ir, source_coordinates, _ = pf.io.read_sofa(self.fileName)

      if sofaDataFunction:
         sofaDataFunction(data_ir)

      def _processAz(az):

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

            processFunction(signal, az, el)

         if endSectionFunction:
            endSectionFunction(az)
         else:
            print('AZ = ', az)

      with ThreadPool() as pool:
         for _ in pool.map(_processAz, range(360)):
            pass
