#

import math
from pathlib import Path

# https://en.wikipedia.org/wiki/Spherical_coordinate_system


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

            elR = math.radians(el)
            x = radius * math.sin(elR) * math.cos(azR)
            y = radius * math.sin(elR) * math.sin(azR)
            z = radius * math.cos(elR)

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
