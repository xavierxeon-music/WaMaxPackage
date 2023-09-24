from PySide6.QtGui import QStandardItemModel

from PySide6.QtCore import Qt
from PySide6.QtGui import QStandardItem

from .notemodel import Note


class EventModel(QStandardItemModel):

    def __init__(self, eventData):

        super().__init__()
        self._eventData = eventData
        # self._eventData.loaded.connect(self.create)
        self._eventData.updated.connect(self.create)

    def create(self):

        self.beginResetModel()
        self.clear()

        activeEventList = self._eventData.compileActiveEventList()
        for col in range(self._eventData.length):

            timePoint = activeEventList[col]
            for rowNumber, value in timePoint.items():
                value1Name = rowNumber
                rowNumber = int(rowNumber)
                if self._eventData.asNotes:
                    noteValue = rowNumber
                    noteIndex = noteValue % 12
                    octave = int((noteValue - noteIndex) / 12)

                    value1Name = Note.noteNames[noteIndex]
                    value1Name += str(octave)

                timeItem = QStandardItem(str(col))
                timeItem.setEditable(False)

                value1Item = QStandardItem(value1Name)
                value1Item.setData(rowNumber)
                value1Item.setEditable(False)

                value2Item = QStandardItem(str(value))

                self.invisibleRootItem().appendRow([timeItem, value1Item, value2Item])

        self.setHorizontalHeaderLabels(['time', 'value1', 'value2'])
        self.endResetModel()

    def setData(self, index, value, role):

        result = super().setData(index, value, role)
        if Qt.EditRole == role and 2 == index.column():
            row = index.row()

            timeItem = self.invisibleRootItem().child(row, 0)
            timePoint = int(timeItem.text())

            value1Item = self.invisibleRootItem().child(row, 1)
            rowNumber = value1Item.data()

            self._eventData.setValue(timePoint, rowNumber, value)

        return result
