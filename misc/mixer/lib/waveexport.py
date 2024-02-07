#

from PySide6.QtCore import QObject


class WaveExport(QObject):

   def __init__(self, crawler):

      super().__init__()

      self.data = crawler.data

   def exportData(self, fileName):

      print(fileName)
