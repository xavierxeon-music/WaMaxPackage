#

from matplotlib.figure import Figure
import numpy as np


from PySide6.QtCore import Signal, QSettings
from PySide6.QtWidgets import QWidget, QGridLayout, QSizePolicy, QCheckBox
from matplotlib.backends.backend_qtagg import FigureCanvas

from .filter import lowpass
from .fit import fitAmplitude, amplitudeFunction, estimateParams
from .paramwidget import ParamWidget


class PointView(QWidget):

   usePeakChanged = Signal(bool)

   def __init__(self, crawler):

      super().__init__()

      self.data = crawler.data

      settings = QSettings()
      self.usePeak = settings.value('usePeak', 'true') == 'true'

      self.peakCheck = QCheckBox('Use Peak')
      self.peakCheck.setChecked(self.usePeak)
      self.peakCheck.clicked.connect(self._usePeackChecked)

      timeFigure = Figure(figsize=(5, 3))
      self.timeCanvas = FigureCanvas(timeFigure)

      fitFigure = Figure(figsize=(5, 3))
      self.fitCanvas = FigureCanvas(fitFigure)
      self.fitCanvas.setSizePolicy(QSizePolicy.Minimum, QSizePolicy.MinimumExpanding)

      self.leftParamWidget = ParamWidget('left ear')
      self.rightParamWidget = ParamWidget('right ear')

      masterLayout = QGridLayout()
      masterLayout.addWidget(self.timeCanvas, 0, 0, 1, 2)
      masterLayout.addWidget(self.peakCheck, 1, 0, 1, 2)
      masterLayout.addWidget(self.fitCanvas, 2, 0, 1, 2)
      masterLayout.addWidget(self.leftParamWidget, 3, 0)
      masterLayout.addWidget(self.rightParamWidget, 3, 1)
      self.setLayout(masterLayout)

   def _usePeackChecked(self, enabled):

      self.usePeak = enabled

      settings = QSettings()
      settings.setValue('usePeak', self.usePeak)

      self.usePeakChanged.emit(enabled)

      self._update()

   def pointSelected(self, az, el):

      self.az = az
      self.el = el

      self._update()

   def _update(self):

      sampleCount = self.data.shape[3]
      samples = np.arange(sampleCount)

      # time plot
      timeFigure = self.timeCanvas.figure
      timeFigure.clf()
      ax = timeFigure.subplots()

      valuesLeft = self.data[self.az, self.el, 0, :]
      ax.plot(samples, valuesLeft, label='data left')

      valuesRight = self.data[self.az, self.el, 1, :]
      ax.plot(samples, valuesRight, label='data right')

      ax.legend(handlelength=4)
      ax.title.set_text('impulse data')
      self.timeCanvas.draw()

      # fit plot
      fitFigure = self.fitCanvas.figure
      fitFigure.clf()
      ax = fitFigure.subplots()

      filterLeft = lowpass(valuesLeft)
      filterRight = lowpass(valuesRight)

      if self.usePeak:
         estimateLeft = estimateParams(filterLeft)
         self.leftParamWidget.setParams(estimateLeft)

         peakLeft = np.zeros(sampleCount)
         peakLeft[estimateLeft[2]] = estimateLeft[0]
         ax.plot(samples, peakLeft, label='peak left')

         estimateRight = estimateParams(filterRight)
         self.rightParamWidget.setParams(estimateRight)

         peakRight = np.zeros(sampleCount)
         peakRight[estimateRight[2]] = estimateRight[0]
         ax.plot(samples, peakRight, label='peak right')
      else:
         try:
            paramLeft = fitAmplitude(filterLeft)
            self.leftParamWidget.setParams(paramLeft)
            fitLeft = amplitudeFunction(samples, paramLeft[0], paramLeft[1], paramLeft[2], paramLeft[3])
            ax.plot(samples, fitLeft, label='fit left')
         except RuntimeError:
            self.leftParamWidget.setParams([-1, -1, -1, -1])

         try:
            paramRight = fitAmplitude(filterRight)
            self.rightParamWidget.setParams(paramRight)
            fitRight = amplitudeFunction(samples, paramRight[0], paramRight[1], paramRight[2], paramRight[3])
            ax.plot(samples, fitRight, label='fit right')
         except RuntimeError:
            self.rightParamWidget.setParams([-1, -1, -1, -1])

      ax.plot(samples, filterLeft, label='filter left', linestyle='dotted')
      ax.plot(samples, filterRight, label='filter right', linestyle='dotted')

      ax.legend(handlelength=4)
      ax.title.set_text('amplitude')
      self.fitCanvas.draw()
