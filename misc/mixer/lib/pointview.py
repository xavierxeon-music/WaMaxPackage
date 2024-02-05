#

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QWidget, QLabel, QVBoxLayout, QFrame

from .pixmap import Pixmap
from .timedata import TimeData


class PointView(QWidget):

   scale = 3

   def __init__(self, crawler):

      super().__init__()

      self.data = crawler.data

      self.timeLabel = QLabel()

      self.timeLabel.setFixedSize(360 * PointView.scale, 180 * PointView.scale)
      # self.timeLabel.setFrameShape(QFrame.Box)

      masterLayout = QVBoxLayout()
      masterLayout.addWidget(self.timeLabel)
      self.setLayout(masterLayout)

   def pointSelected(self, az, el):

      import matplotlib.pyplot as plt
      import numpy as np

      fileName = 'data/_tmp.png'

      valuesLeft = self.data[az, el, 0, :]
      valuesRight = self.data[az, el, 1, :]

      fig, ax = plt.subplots()
      # plt.axis('off')

      sampleCount = int(self.data.shape[3])
      samples = range(sampleCount)

      ax.plot(samples, valuesLeft, label='data left')
      ax.plot(samples, valuesRight, label='data right')
      """
      fitLeft = np.polyfit(samples, valuesLeft, 30)
      fitRight = np.polyfit(samples, valuesRight, 30)

      polyLeft = np.poly1d(fitLeft)
      polyRight = np.poly1d(fitRight)

      ax.plot(samples, polyLeft(samples), label='fit left')
      ax.plot(samples, polyRight(samples), label='fit right')
      """
      ax.legend(handlelength=4)

      plt.savefig(fileName, dpi=300, bbox_inches='tight', pad_inches=0)
      plt.close()

      pixmap = Pixmap()
      pixmap.load(fileName)

      pixmap = pixmap.scaled(360 * PointView.scale, 180 * PointView.scale, Qt.KeepAspectRatio, Qt.SmoothTransformation)

      self.timeLabel.setPixmap(pixmap)
