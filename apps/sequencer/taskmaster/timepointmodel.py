from PySide6.QtGui import QStandardItemModel

from PySide6.QtGui import QStandardItem

from .calendar import Calender


class TimePointModel(QStandardItemModel):

    def __init__(self):

        super().__init__()

        Calender.the.loaded.connect(self._create)

    def _create(self):

        self.clear()

        for timePoint in Calender.the.data:

            tpItem = QStandardItem(timePoint)
            self.invisibleRootItem().appendRow(tpItem)

        self.setHorizontalHeaderLabels(['time point'])
