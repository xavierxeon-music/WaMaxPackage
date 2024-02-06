#

import os

from PySide6.QtCore import QByteArray, QIODevice, QDataStream, Qt
from PySide6.QtGui import QPixmap


class Pixmap(QPixmap):

   scale = 2

   def __reduce__(self):

      return type(self), (), self.__getstate__()

   def __getstate__(self):

      ba = QByteArray()
      stream = QDataStream(ba, QIODevice.WriteOnly)
      stream << self
      return ba

   def __setstate__(self, ba):

      stream = QDataStream(ba, QIODevice.ReadOnly)
      stream >> self

   @staticmethod
   def plotToLabel(axisFunction, label, saveFunction=None):

      import matplotlib.pyplot as plt
      fileName = 'data/_tmp.png'

      fig, ax = plt.subplots()
      axisFunction(ax)

      plt.savefig(fileName, dpi=300, bbox_inches='tight', pad_inches=0)
      plt.close()

      pixmap = Pixmap()
      pixmap.load(fileName)
      if saveFunction:
         saveFunction(pixmap)

      pixmap = pixmap.scaled(360 * Pixmap.scale, 180 * Pixmap.scale, Qt.KeepAspectRatio, Qt.SmoothTransformation)

      label.setPixmap(pixmap)

      os.remove(fileName)
