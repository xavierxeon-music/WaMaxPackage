#


from PySide6.QtCore import Qt
from PySide6.QtWidgets import QWidget, QLabel, QSlider, QSpinBox, QGridLayout, QFrame, QSizePolicy


class TimeView(QWidget):

   def __init__(self):

      super().__init__()

      def _initLabel(label):

         label.setFixedSize(380, 180)
         label.setFrameShape(QFrame.Box)

      self.leftLabel = QLabel()
      _initLabel(self.leftLabel)

      self.rightLabel = QLabel()
      _initLabel(self.rightLabel)

      self.timeSlider = QSlider()
      self.timeSlider.setOrientation(Qt.Horizontal)

      self.timeSpin = QSpinBox()

      masterLayout = QGridLayout()
      masterLayout.addWidget(self.leftLabel, 0, 0, 1, 2)
      masterLayout.addWidget(self.rightLabel, 1, 0, 1, 2)
      masterLayout.addWidget(self.timeSlider, 2, 0)
      masterLayout.addWidget(self.timeSpin, 2, 1)
      self.setLayout(masterLayout)
