#

from PySide6.QtCore import QByteArray, QIODevice, QDataStream
from PySide6.QtGui import QPixmap


class Pixmap(QPixmap):

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
