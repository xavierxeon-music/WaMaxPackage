#

from matplotlib.figure import Figure
import numpy as np


from PySide6.QtCore import Signal
from PySide6.QtWidgets import QWidget, QGridLayout, QPushButton, QSizePolicy, QFileDialog, QProgressBar
from matplotlib.backends.backend_qtagg import FigureCanvas

from .filter import lowpass
from .fit import fitAmplitude, amplitudeFunction
from .paramview import ParamView


class PointView(QWidget):

   exportData = Signal(str)

   def __init__(self, crawler):

      super().__init__()

      self.data = crawler.data

      timeFigure = Figure(figsize=(5, 3))
      self.timeCanvas = FigureCanvas(timeFigure)

      fitFigure = Figure(figsize=(5, 3))
      self.fitCanvas = FigureCanvas(fitFigure)
      self.fitCanvas.setSizePolicy(QSizePolicy.Minimum, QSizePolicy.MinimumExpanding)

      self.leftParamView = ParamView('left ear')
      self.rightParamView = ParamView('right ear')

      self.exportButton = QPushButton('Export Wav')
      self.exportButton.clicked.connect(self._exportClicked)

      masterLayout = QGridLayout()
      masterLayout.addWidget(self.timeCanvas, 0, 0, 1, 2)
      masterLayout.addWidget(self.fitCanvas, 1, 0, 1, 2)
      masterLayout.addWidget(self.leftParamView, 2, 0)
      masterLayout.addWidget(self.rightParamView, 2, 1)
      masterLayout.addWidget(self.exportButton, 3, 0, 1, 2)
      self.setLayout(masterLayout)

   def _exportClicked(self):

      fileName = QFileDialog.getSaveFileName(None, 'Wave File', None, '*.wav')
      fileName = fileName[0]
      if not fileName:
         return

      self.exportData.emit(fileName)

   def pointSelected(self, az, el):

      sampleCount = self.data.shape[3]
      samples = np.arange(sampleCount)

      # time plot
      timeFigure = self.timeCanvas.figure
      timeFigure.clf()
      ax = timeFigure.subplots()

      valuesLeft = self.data[az, el, 0, :]
      ax.plot(samples, valuesLeft, label='data left')

      valuesRight = self.data[az, el, 1, :]
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

      try:
         paramLeft = fitAmplitude(filterLeft)
         self.leftParamView.setParams(paramLeft)
         fitLeft = amplitudeFunction(samples, paramLeft[0], paramLeft[1], paramLeft[2], paramLeft[3])
         ax.plot(samples, fitLeft, label='fit left')
      except RuntimeError:
         self.leftParamView.setParams([-1, -1, -1, -1])

      try:
         paramRight = fitAmplitude(filterRight)
         self.rightParamView.setParams(paramRight)
         fitRight = amplitudeFunction(samples, paramRight[0], paramRight[1], paramRight[2], paramRight[3])
         ax.plot(samples, fitRight, label='fit right')
      except RuntimeError:
         self.rightParamView.setParams([-1, -1, -1, -1])

      ax.plot(samples, filterLeft, label='filter left', linestyle='dotted')
      ax.plot(samples, filterRight, label='filter right', linestyle='dotted')

      ax.legend(handlelength=4)
      ax.title.set_text('amplitude')
      self.fitCanvas.draw()
