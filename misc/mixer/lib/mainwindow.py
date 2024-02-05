#

from PySide6.QtWidgets import QWidget, QVBoxLayout

from .plotcrawler import PlotCrawler
from .pointview import PointView
from .timeview import TimeView


class MainWindow(QWidget):

   def __init__(self, fileName):

      super().__init__()

      crawler = PlotCrawler(fileName)
      self.setWindowTitle('SofaAnalyser - ' + crawler.name)

      self.timeView = TimeView(crawler)
      self.pointView = PointView(crawler)

      masterLayout = QVBoxLayout()
      masterLayout.setContentsMargins(0, 0, 0, 0)
      masterLayout.addWidget(self.timeView)
      masterLayout.addWidget(self.pointView)
      self.setLayout(masterLayout)
