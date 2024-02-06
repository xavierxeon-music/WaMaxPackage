#

from matplotlib.figure import Figure
import numpy as np


from PySide6.QtWidgets import QWidget, QVBoxLayout, QLineEdit
from matplotlib.backends.backend_qtagg import FigureCanvas

from .filter import lowpass
from .fit import normalFit


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

      samples = np.arange(self.data.shape[3])

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

      fitLeft = normalFit(filterLeft)
      fitRight = normalFit(filterRight)

      fitFigure = self.fitCanvas.figure
      fitFigure.clf()
      ax = fitFigure.subplots()

      ax.plot(samples, filterLeft, label='filter left')
      ax.plot(samples, filterRight, label='filter right')

      ax.legend(handlelength=4)
      self.fitCanvas.draw()
