#


from PySide6.QtCore import Qt
from PySide6.QtGui import QPixmap
from PySide6.QtWidgets import QWidget, QLabel, QSlider, QSpinBox, QGridLayout, QFrame, QSizePolicy

from .timedata import TimeData


class TimeView(QWidget):

   def __init__(self, crawler):

      super().__init__()

      self.timeData = TimeData(crawler)

      def _initLabel(label):

         label.setFixedSize(360 * TimeData.scale, 180 * TimeData.scale)
         label.setFrameShape(QFrame.Box)

      self.leftLabel = QLabel()
      _initLabel(self.leftLabel)

      self.rightLabel = QLabel()
      _initLabel(self.rightLabel)

      maxSampleIndex = self.timeData.sampleCount - 1

      self.timeSlider = QSlider()
      self.timeSlider.setRange(0, maxSampleIndex)
      self.timeSlider.setOrientation(Qt.Horizontal)
      self.timeSlider.valueChanged.connect(self._sliderChange)

      self.timeSpin = QSpinBox()
      self.timeSpin.setRange(0, maxSampleIndex)
      self.timeSpin.valueChanged.connect(self._spinChange)

      masterLayout = QGridLayout()
      masterLayout.addWidget(self.leftLabel, 0, 0, 1, 2)
      masterLayout.addWidget(self.rightLabel, 1, 0, 1, 2)
      masterLayout.addWidget(self.timeSlider, 2, 0)
      masterLayout.addWidget(self.timeSpin, 2, 1)
      self.setLayout(masterLayout)

      self._updateImages(0)

   def _sliderChange(self, index):

      self.timeSpin.blockSignals(True)
      self.timeSpin.setValue(index)
      self.timeSpin.blockSignals(False)

      self._updateImages(index)

   def _spinChange(self, index):

      self.timeSlider.blockSignals(True)
      self.timeSlider.setValue(index)
      self.timeSlider.blockSignals(False)

      self._updateImages(index)

   def _updateImages(self, index):

      pixmap = self.timeData.pixmaps[0][index]
      self.leftLabel.setPixmap(pixmap)

      pixmap = self.timeData.pixmaps[1][index]
      self.rightLabel.setPixmap(pixmap)
