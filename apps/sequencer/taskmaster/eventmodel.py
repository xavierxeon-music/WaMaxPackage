from PySide6.QtGui import QStandardItemModel

from .calendar import Calender


class EventModel(QStandardItemModel):

    def __init__(self):

        super().__init__()

        Calender.the.loaded.connect(self._create)

    def _create(self):

        self.clear()

        self.setHorizontalHeaderLabels(['name', 'value'])
