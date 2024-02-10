#

from PySide6.QtCore import Signal
from PySide6.QtWidgets import QWidget, QPushButton, QGridLayout, QFileDialog


class PeakView(QWidget):

   exportData = Signal(str)

   def __init__(self, crawler):

      super().__init__()

      self.data = crawler.data

      self.exportButton = QPushButton('Export Wav')
      self.exportButton.clicked.connect(self._exportClicked)

      masterLayout = QGridLayout()
      masterLayout.addWidget(self.exportButton, 3, 0, 1, 2)
      self.setLayout(masterLayout)

   def _exportClicked(self):

      fileName = QFileDialog.getSaveFileName(None, 'Wave File', None, '*.wav')
      fileName = fileName[0]
      if not fileName:
         return

      self.exportData.emit(fileName)

   def exportProgress(self, value, max):

      print('EXPORT', value, max)
