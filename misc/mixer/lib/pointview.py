#

import math

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QWidget, QLabel, QVBoxLayout, QFrame, QLineEdit

from .pixmap import Pixmap


class PointView(QWidget):

   def __init__(self, crawler):

      super().__init__()

      self.data = crawler.data

      def _initLabel(label):

         label.setFixedSize(360 * Pixmap.scale, 180 * Pixmap.scale)
         label.setFrameShape(QFrame.Box)

      self.timeLabel = QLabel()
      _initLabel(self.timeLabel)

      self.fitLabel = QLabel()
      _initLabel(self.fitLabel)

      self.coeffShow = QLineEdit()

      masterLayout = QVBoxLayout()
      masterLayout.addWidget(self.timeLabel)
      masterLayout.addWidget(self.fitLabel)
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

      def timePlot(ax):

         ax.plot(samples, valuesLeft, label='data left')
         ax.plot(samples, valuesRight, label='data right')

         ax.legend(handlelength=4)

      # time plot

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

      def fitPlot(ax):

         filterLeft = filter(valuesLeft)
         filterRight = filter(valuesRight)

         ax.plot(samples, filterLeft, label='filter left')
         ax.plot(samples, filterRight, label='filter right')
         """
         fitLeft = np.polyfit(samples, filterLeft, 11)
         fitRight = np.polyfit(samples, filterRight, 11)

         polyLeft = np.poly1d(fitLeft)
         polyRight = np.poly1d(fitRight)

         ax.plot(samples, polyLeft(samples), label='fit left')
         ax.plot(samples, polyRight(samples), label='fit right')
         """
         ax.legend(handlelength=4)

      Pixmap.plotToLabel(timePlot, self.timeLabel)
      Pixmap.plotToLabel(fitPlot, self.fitLabel)
