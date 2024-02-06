#

import math

from matplotlib.backends.backend_qtagg import FigureCanvas
from matplotlib.figure import Figure

from PySide6.QtWidgets import QWidget, QVBoxLayout, QLineEdit


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

      import matplotlib.pyplot as plt
      import numpy as np

      fileName = 'data/_tmp.png'

      valuesLeft = self.data[az, el, 0, :]
      valuesRight = self.data[az, el, 1, :]

      sampleCount = int(self.data.shape[3])
      samples = range(sampleCount)

      # time plot
      timeFigure = self.timeCanvas.figure
      timeFigure.clf()
      ax = timeFigure.subplots()

      ax.plot(samples, valuesLeft, label='data left')
      ax.plot(samples, valuesRight, label='data right')

      ax.legend(handlelength=4)
      self.timeCanvas.draw()

      # fit plot
      def filter(series):

         factor = 0.2
         cutoff = 0.01

         length = series.shape[0]
         for index in range(length):
            series[index] = math.fabs(series[index])
            if series[index] < cutoff:
               series[index] = 0.0

         out = np.zeros(series.shape)
         for index in range(length):
            if 0 == index:
               out[0] = factor * series[0]
            else:
               out[index] = out[index - 1] + factor * (series[index] - out[index - 1])

         for index in range(length):
            if out[index] < cutoff:
               out[index] = 0.0

         return out

      filterLeft = filter(valuesLeft)
      filterRight = filter(valuesRight)

      fitFigure = self.fitCanvas.figure
      fitFigure.clf()
      ax = fitFigure.subplots()

      ax.plot(samples, filterLeft, label='filter left')
      ax.plot(samples, filterRight, label='filter right')

      ax.legend(handlelength=4)
      self.fitCanvas.draw()
