#

from PySide6.QtCore import QSettings
from PySide6.QtWidgets import QGroupBox, QLabel, QLineEdit, QGridLayout, QSizePolicy


class ParamWidget(QGroupBox):

   def __init__(self, name):

      super().__init__()

      self.setTitle(name)
      self.setSizePolicy(QSizePolicy.Minimum, QSizePolicy.Minimum)

      masterLayout = QGridLayout()
      masterLayout.setContentsMargins(0, 0, 0, 0)
      self.setLayout(masterLayout)

      self.displayList = list()

      def addRow(title, row, suffix):

         titleLabel = QLabel(title)
         masterLayout.addWidget(titleLabel, row, 0)

         displayEdit = QLineEdit()
         displayEdit.setReadOnly(True)
         masterLayout.addWidget(displayEdit, row, 1)

         self.displayList.append(displayEdit)

         if not suffix:
            return

         suffixLabel = QLabel(suffix)
         masterLayout.addWidget(suffixLabel, row, 2)

      addRow('max', 0, None)
      addRow('start', 1, 'samples')
      addRow('peak', 2, 'samples')
      addRow('end', 3, 'samples')

   def setParams(self, params):

      for index, displayEdit in enumerate(self.displayList):
         displayEdit.setText("{:.4f}".format(params[index]))
