#

from PySide6.QtWidgets import QWidget, QHBoxLayout

from .plotcrawler import PlotCrawler
from .pointview import PointView
from .timeview import TimeView
from .waveexport import WaveExport


class MainWindow(QWidget):

   def __init__(self, fileName):

      super().__init__()

      crawler = PlotCrawler(fileName)
      self.name = 'SofaAnalyser - ' + crawler.name

      self.timeView = TimeView(crawler)
      self.pointView = PointView(crawler)

      self.waveExport = WaveExport(crawler)

      self.timeView.pointSelected.connect(self.pointView.pointSelected)
      self.timeView.pointSelected.connect(self.changeTitle)

      self.pointView.exportData.connect(self.waveExport.exportData)

      az = 284
      el = 151
      self.changeTitle(az, el)
      self.pointView.pointSelected(az, el)

      masterLayout = QHBoxLayout()
      masterLayout.setContentsMargins(0, 0, 0, 0)
      masterLayout.setSpacing(0)
      masterLayout.addWidget(self.timeView)
      masterLayout.addWidget(self.pointView)
      self.setLayout(masterLayout)

   def changeTitle(self, az, el):

      title = f'{self.name} [ {az}, {el} ]'
      self.setWindowTitle(title)
