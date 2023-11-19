from PySide6.QtGui import QStandardItemModel

from PySide6.QtGui import QStandardItem

from .calendar import Calender


class EventModel(QStandardItemModel):

    def __init__(self):

        super().__init__()

        Calender.the.loaded.connect(self._clear)
        Calender.the.timePointSelected.connect(self._timePoint)

    def _clear(self):

        self.clear()

        self.setHorizontalHeaderLabels(['name', 'value'])

    def _timePoint(self, timePoint):

        self.clear()

        for entry in Calender.the.data[timePoint]:

            data = entry.split(' ')
            nameItem = QStandardItem(data[0])
            valueItem = QStandardItem(data[1] if len(data) > 1 else '')

            self.invisibleRootItem().appendRow([nameItem, valueItem])

        self.setHorizontalHeaderLabels(['name', 'value'])
