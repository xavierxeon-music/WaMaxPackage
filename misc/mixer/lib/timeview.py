#

from matplotlib.figure import Figure
import numpy as np

from PySide6.QtCore import QTimer, Qt, Signal
from PySide6.QtWidgets import QWidget, QLabel, QToolButton, QSlider, QSpinBox, QGridLayout
from matplotlib.backends.backend_qtagg import FigureCanvas


class TimeView(QWidget):

   pointSelected = Signal(int, int)

   def __init__(self, crawler):

      super().__init__()

      self.data = crawler.data
      self.maxSampleIndex = self.data.shape[3] - 1
      self.currentIndex = 0

      self.leftCanvas = FigureCanvas(Figure(layout="compressed"))
      self.leftCanvas.mpl_connect('button_release_event', self._onClick)

      self.rightCanvas = FigureCanvas(Figure(layout="compressed"))
      self.rightCanvas.mpl_connect('button_release_event', self._onClick)

      timeLabel = QLabel('Time')

      self.playText = '\u25B6'
      self.pauseText = '\u23F8'
      self.animateTimeButton = QToolButton()
      self.animateTimeButton.setText(self.playText)
      self.animateTimeButton.setCheckable(True)
      self.animateTimeButton.clicked.connect(self._animateClicked)

      self.animationTimer = QTimer()
      self.animationTimer.setInterval(100)
      self.animationTimer.timeout.connect(self._animate)

      self.timeSlider = QSlider()
      self.timeSlider.setRange(0, self.maxSampleIndex)
      self.timeSlider.setOrientation(Qt.Horizontal)
      self.timeSlider.valueChanged.connect(self._sliderChange)

      self.timeSpin = QSpinBox()
      self.timeSpin.setRange(0, self.maxSampleIndex)
      self.timeSpin.valueChanged.connect(self._spinChange)

      masterLayout = QGridLayout()
      masterLayout.addWidget(self.leftCanvas, 0, 0, 1, 4)
      masterLayout.addWidget(self.rightCanvas, 1, 0, 1, 4)
      masterLayout.addWidget(timeLabel, 2, 0)
      masterLayout.addWidget(self.animateTimeButton, 2, 1)
      masterLayout.addWidget(self.timeSlider, 2, 2)
      masterLayout.addWidget(self.timeSpin, 2, 3)
      self.setLayout(masterLayout)

      self._updateImages(0)

   def setIndex(self, index):

      self.timeSpin.blockSignals(True)
      self.timeSpin.setValue(index)
      self.timeSpin.blockSignals(False)

      self.timeSlider.blockSignals(True)
      self.timeSlider.setValue(index)
      self.timeSlider.blockSignals(False)

      self.currentIndex = index
      self._updateImages(index)

   def _animateClicked(self, enabled):

      if enabled:
         self.animateTimeButton.setText(self.pauseText)
         self.animationTimer.start()
      else:
         self.animateTimeButton.setText(self.playText)
         self.animationTimer.stop()

   def _animate(self):

      index = self.currentIndex + 1
      if index >= self.maxSampleIndex:
         index = 0

      self.setIndex(index)

   def _onClick(self, event):

      if None == event.xdata or None == event.ydata:
         return

      az = int(event.xdata)
      el = int(180 - event.ydata)
      # print(az, el)
      self.pointSelected.emit(az, el)

   def _sliderChange(self, index):

      self.timeSpin.blockSignals(True)
      self.timeSpin.setValue(index)
      self.timeSpin.blockSignals(False)

      self.currentIndex = index
      self._updateImages(index)

   def _spinChange(self, index):

      self.timeSlider.blockSignals(True)
      self.timeSlider.setValue(index)
      self.timeSlider.blockSignals(False)

      self.currentIndex = index
      self._updateImages(index)

   def _updateImages(self, index):

      def _fill(side, canvas):

         valueList = self.data[:, :, side, index]
         valueList = np.transpose(valueList)

         canvas.figure.clf()
         ax = canvas.figure.subplots()

         ax.pcolormesh(valueList)

         ax.invert_yaxis()
         ax.title.set_text('left ear' if 0 == side else 'right ear')
         canvas.draw()

      _fill(0, self.leftCanvas)
      _fill(1, self.rightCanvas)
