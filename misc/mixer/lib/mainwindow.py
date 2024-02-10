#

from PySide6.QtCore import QSettings
from PySide6.QtWidgets import QWidget, QHBoxLayout

from .peakview import PeakView
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
      self.peakView = PeakView(crawler)

      self.waveExport = WaveExport(crawler)

      self.timeView.pointSelected.connect(self.pointView.pointSelected)
      self.timeView.pointSelected.connect(self.changeTitle)

      self.peakView.exportData.connect(self.waveExport.exportData)
      self.waveExport.exportProgress.connect(self.peakView.exportProgress)

      az = 80
      el = 75
      self.changeTitle(az, el)
      self.pointView.pointSelected(az, el)

      self.timeView.setIndex(50)

      masterLayout = QHBoxLayout()
      masterLayout.setContentsMargins(0, 0, 0, 0)
      masterLayout.setSpacing(0)
      masterLayout.addWidget(self.timeView)
      masterLayout.addWidget(self.pointView)
      masterLayout.addWidget(self.peakView)
      self.setLayout(masterLayout)

      settings = QSettings()
      print(settings.fileName())

      geometry = settings.value('geometry')
      if geometry:
         self.restoreGeometry(geometry)

   def closeEvent(self, event):

      settings = QSettings()
      settings.setValue('geometry', self.saveGeometry())

      event.accept()

   def changeTitle(self, az, el):

      title = f'{self.name} [ {az}, {el} ]'
      self.setWindowTitle(title)
