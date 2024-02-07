#

from matplotlib.figure import Figure
import numpy as np


from PySide6.QtCore import Signal
from PySide6.QtWidgets import QWidget, QGridLayout, QPushButton, QSizePolicy, QFileDialog
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

      valuesLeft = self.data[az, el, 0, :]
      valuesRight = self.data[az, el, 1, :]

      sampleCount = self.data.shape[3]
      samples = np.arange(sampleCount)

      # time plot
      timeFigure = self.timeCanvas.figure
      timeFigure.clf()
      ax = timeFigure.subplots()

      ax.plot(samples, valuesLeft, label='data left')
      ax.plot(samples, valuesRight, label='data right')

      ax.legend(handlelength=4)
      ax.title.set_text('impulse data')
      self.timeCanvas.draw()

      # fit plot
      filterLeft = lowpass(valuesLeft)
      filterRight = lowpass(valuesRight)

      paramLeft = fitAmplitude(filterLeft)
      self.leftParamView.setParams(paramLeft)

      paramRight = fitAmplitude(filterRight)
      self.rightParamView.setParams(paramRight)

      fitLeft = amplitudeFunction(samples, paramLeft[0], paramLeft[1], paramLeft[2], paramLeft[3])
      fitRight = amplitudeFunction(samples, paramRight[0], paramRight[1], paramRight[2], paramRight[3])

      fitFigure = self.fitCanvas.figure
      fitFigure.clf()
      ax = fitFigure.subplots()

      ax.plot(samples, fitLeft, label='fit left')
      ax.plot(samples, fitRight, label='fit right')

      ax.plot(samples, filterLeft, label='filter left', linestyle='dotted')
      ax.plot(samples, filterRight, label='filter right', linestyle='dotted')

      ax.legend(handlelength=4)
      ax.title.set_text('amplitude')
      self.fitCanvas.draw()
