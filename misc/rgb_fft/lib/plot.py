#

import sys

try:
   import matplotlib.pyplot as plt
except ModuleNotFoundError:
   print('pip3 install --user matplotlib')
   sys.exit(1)


class Plot:

   def __init__(self, data):

      self.data = data

   def create(self, fileName):

      w = list()
      r = list()
      g = list()
      b = list()

      for entry in self.data:
         w.append(1.0 / entry.waveLength)
         r.append(entry.red)
         g.append(entry.green)
         b.append(entry.blue)

      fig, ax = plt.subplots()
      ax.plot(w, r, 'red', label='red')
      ax.plot(w, g, 'green', label='green')
      ax.plot(w, b, 'blue', label='blue')
      ax.legend()

      print(fileName)
      plt.savefig(fileName, bbox_inches='tight')
