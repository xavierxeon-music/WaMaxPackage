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

        self.setHorizontalHeaderLabels(['bar.div', 'length', 'loop'])
        self.endResetModel()
