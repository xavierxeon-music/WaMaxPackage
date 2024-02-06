#

import math

from matplotlib.backends.backend_qtagg import FigureCanvas
from matplotlib.figure import Figure
import numpy as np

from PySide6.QtWidgets import QWidget, QVBoxLayout, QLineEdit


def filter(series):

   factor = 0.2
   cutoff = 0.01

   maxIn = 0.0
   maxOut = 0.0

   length = series.shape[0]
   out = np.zeros(series.shape)
   for index in range(length):
      # rectiy input
      inValue = math.fabs(series[index])
      if inValue < cutoff:
         inValue = 0.0
      if inValue > maxIn:
         maxIn = inValue

      # filter
      if 0 == index:
         out[0] = factor * inValue
      else:
         lastOut = out[index - 1]
         outValue = lastOut + factor * (inValue - lastOut)
         if outValue > maxOut:
            maxOut = outValue
         out[index] = outValue

   if maxIn > 1.0:
      maxIn = 1.0

   boost = maxIn / maxOut

   for index in range(length):
      outValue = out[index] * boost
      if outValue < cutoff:
         out[index] = 0.0
      else:
         out[index] = outValue

   return out


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
      filterLeft = filter(valuesLeft)
      filterRight = filter(valuesRight)

      fitFigure = self.fitCanvas.figure
      fitFigure.clf()
      ax = fitFigure.subplots()

      ax.plot(samples, filterLeft, label='filter left')
      ax.plot(samples, filterRight, label='filter right')

      ax.legend(handlelength=4)
      self.fitCanvas.draw()
