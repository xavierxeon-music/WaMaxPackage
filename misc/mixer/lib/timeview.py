#

from matplotlib.figure import Figure
import numpy as np

from PySide6.QtCore import Qt, Signal
from PySide6.QtWidgets import QWidget, QSlider, QSpinBox, QGridLayout
from matplotlib.backends.backend_qtagg import FigureCanvas


class TimeView(QWidget):

   pointSelected = Signal(int, int)

   def __init__(self, crawler):

      super().__init__()

      self.data = crawler.data
      maxSampleIndex = self.data.shape[3] - 1

      self.leftCanvas = FigureCanvas(Figure(layout="compressed"))
      self.leftCanvas.mpl_connect('button_release_event', self._onClick)

      self.rightCanvas = FigureCanvas(Figure(layout="compressed"))
      self.rightCanvas.mpl_connect('button_release_event', self._onClick)

      self.timeSlider = QSlider()
      self.timeSlider.setRange(0, maxSampleIndex)
      self.timeSlider.setOrientation(Qt.Horizontal)
      self.timeSlider.valueChanged.connect(self._sliderChange)

      self.timeSpin = QSpinBox()
      self.timeSpin.setRange(0, maxSampleIndex)
      self.timeSpin.valueChanged.connect(self._spinChange)

      masterLayout = QGridLayout()
      masterLayout.addWidget(self.leftCanvas, 0, 0, 1, 2)
      masterLayout.addWidget(self.rightCanvas, 1, 0, 1, 2)
      masterLayout.addWidget(self.timeSlider, 2, 0)
      masterLayout.addWidget(self.timeSpin, 2, 1)
      self.setLayout(masterLayout)

      self._updateImages(0)

   def _onClick(self, event):

      az = int(event.xdata)
      el = int(180 - event.ydata)
      # print(az, el)
      self.pointSelected.emit(az, el)

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

      def _fill(side, canvas):

         valueList = self.data[:, :, side, index]
         valueList = np.transpose(valueList)
         valueList = np.flipud(valueList)

         canvas.figure.clf()
         ax = canvas.figure.subplots()

         ax.pcolormesh(valueList)

         ax.set_axis_off()
         canvas.draw()

      _fill(0, self.leftCanvas)
      _fill(1, self.rightCanvas)
