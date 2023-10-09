from PySide6.QtGui import QStandardItemModel

from PySide6.QtCore import Qt
from PySide6.QtGui import QStandardItem


class StartModel(QStandardItemModel):

    def __init__(self, timeline):

        super().__init__()
        self._timeline = timeline

        self._timeline.sequenceUpdated.connect(self.create)

    def create(self):

        self.beginResetModel()
        self.clear()

        for timeStamp, sequence in self._timeline.sequences.items():

            timeStampItem = QStandardItem(timeStamp)

            lengthItem = QStandardItem(str(sequence.length))
            lengthItem.setData(sequence.length)
            lengthItem.setCheckable(True)
            lengthItem.setCheckState(Qt.Checked if sequence.loop else Qt.Unchecked)

            self.invisibleRootItem().appendRow([timeStampItem, lengthItem])

        self.setHorizontalHeaderLabels(['bar.div', 'length'])
        self.endResetModel()

    def setData(self, index, value, role):

        oldValue = self.data(index)
        result = super().setData(index, value, role)
        if Qt.EditRole == role:
            print('EDIT', index.row(), oldValue, ' = > ', value)
        elif Qt.CheckStateRole == role:
            loop = (value == 2)  # Qt::Checked
            print('LOOP', index.row(), loop)
        return result
