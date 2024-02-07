#

from matplotlib.figure import Figure
import numpy as np


from PySide6.QtWidgets import QWidget, QVBoxLayout, QLineEdit
from matplotlib.backends.backend_qtagg import FigureCanvas

from .filter import lowpass
from .fit import normalFit, fitFunction


class PointView(QWidget):

   def __init__(self, crawler):

      super().__init__()

      self.data = crawler.data

      timeFigure = Figure(figsize=(5, 3))
      self.timeCanvas = FigureCanvas(timeFigure)

      fitFigure = Figure(figsize=(5, 3))
      self.fitCanvas = FigureCanvas(fitFigure)

      self.coeffShow = QLineEdit()

      masterLayout = QVBoxLayout()
      masterLayout.addWidget(self.timeCanvas)
      masterLayout.addWidget(self.fitCanvas)
      masterLayout.addWidget(self.coeffShow)
      self.setLayout(masterLayout)

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
      self.timeCanvas.draw()

      # fit plot
      filterLeft = lowpass(valuesLeft)
      filterRight = lowpass(valuesRight)

      paramLeft = normalFit(filterLeft)
      paramRight = normalFit(filterRight)

      fitLeft = fitFunction(samples, paramLeft[0], paramLeft[1], paramLeft[2], paramLeft[3])
      fitRight = fitFunction(samples, paramRight[0], paramRight[1], paramRight[2], paramRight[3])

      fitFigure = self.fitCanvas.figure
      fitFigure.clf()
      ax = fitFigure.subplots()

      ax.plot(samples, fitLeft, label='fit left')
      ax.plot(samples, fitRight, label='fit right')

      ax.plot(samples, filterLeft, label='filter left', linestyle='dotted')
      ax.plot(samples, filterRight, label='filter right', linestyle='dotted')

      ax.legend(handlelength=4)
      self.fitCanvas.draw()
