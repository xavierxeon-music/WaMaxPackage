
from PySide6.QtGui import QStandardItemModel

from PySide6.QtCore import Qt
from PySide6.QtGui import QStandardItem

from .timeline import TimeLine


class TimePointModel(QStandardItemModel):

    LengthRole = Qt.UserRole + 2

    def __init__(self):

        super().__init__()

        TimeLine.the.sequenceUpdated.connect(self.create)

    def create(self):

        self.beginResetModel()
        self.clear()

        for timeStamp, sequence in TimeLine.the.sequences.items():

            timeStampItem = QStandardItem(timeStamp)

            lengthItem = QStandardItem(str(sequence.length))
            lengthItem.setData(sequence.length, TimePointModel.LengthRole)
            lengthItem.setCheckable(True)
            lengthItem.setCheckState(Qt.Checked if sequence.loop else Qt.Unchecked)

            self.invisibleRootItem().appendRow([timeStampItem, lengthItem])

        self.setHorizontalHeaderLabels(['bar.div', 'loop / length'])
        self.endResetModel()

    def setData(self, index, value, role):

        if Qt.EditRole == role:
            if 0 == index.column():
                if not self._setTimeStamp(index.row(), value):
                    return False
            elif 1 == index.column():
                if not self._setLength(index.row(), value):
                    return False
        elif Qt.CheckStateRole == role:
            loop = (value == 2)  # Qt::Checked
            if not self._setLoop(index.row(), loop):
                return False

        return super().setData(index, value, role)

    def isValidTimePoint(self, timePoint):

        content = timePoint.split('.')
        if 2 != len(content):
            return False

        try:
            bar = int(content[0])
            beat = int(content[1])
        except ValueError:
            return False

        if timePoint in self._timeline.sequences:
            return False

        return True

    def _setTimeStamp(self, row, value):

        print('TIMESTAMP', row, value)
        return True

    def _setLength(self, row, value):

        try:
            length = int(value)
        except ValueError:
            return False

        if length < 1:
            return False

        print('LENGTH', row, value)
        return True

    def _setLoop(self, row, loop):

        print('LOOP', row, loop)
        return True
