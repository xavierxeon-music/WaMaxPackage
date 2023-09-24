from PySide6.QtGui import QStandardItemModel

from PySide6.QtGui import QStandardItem, QColor


class Note:

    noteNames = ['C', 'C#', 'D', 'D#',  'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    blackKeys = [False, True, False, True, False, False, True, False, True, False, True, False]


class NoteModel(QStandardItemModel):

    def __init__(self, eventData):

        super().__init__()
        self._eventData = eventData
        self._eventData.loaded.connect(self.create)
        self._eventData.updated.connect(self.updateColors)

    def create(self):

        self.beginResetModel()
        self.clear()

        rowHeaders = []
        for row in range(128):
            rowNumber = 127 - row
            if self._eventData.asNotes:
                rowIndex = rowNumber % 12
                octave = int((rowNumber - rowIndex) / 12)
                rowNumber = Note.noteNames[rowIndex]
                rowNumber += str(octave)
            else:
                rowNumber = str(rowNumber)
            rowHeaders.append(rowNumber)

            rowItems = []
            for col in range(self._eventData.length):
                rowItem = QStandardItem()
                rowItem.setEditable(False)
                rowItems.append(rowItem)

            self.invisibleRootItem().appendRow(rowItems)

        self.setVerticalHeaderLabels(rowHeaders)
        self.endResetModel()

    def updateColors(self):

        for row in range(128):
            rowNumber = 127 - row
            rowIndex = rowNumber % 12
            for col in range(self._eventData.length):
                rowItem = self.invisibleRootItem().child(row, col)
                cell = self._eventData.eventList[col][rowNumber]

                if cell.active:
                    rowItem.setBackground(QColor(200, 200, 255))
                elif Note.blackKeys[rowIndex]:
                    rowItem.setBackground(QColor(250, 250, 250))
                elif 0 == col % 4:
                    rowItem.setBackground(QColor(255, 255, 240))
                else:
                    rowItem.setBackground(QColor(255, 255, 255))

    def toggle(self, index):

        rowNumber = 127 - index.row()
        timePoint = index.column()

        self._eventData.toggle(timePoint, rowNumber)
