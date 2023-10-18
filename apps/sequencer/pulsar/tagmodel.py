from PySide6.QtGui import QStandardItemModel

from PySide6.QtGui import QStandardItem


class TagModel(QStandardItemModel):

    def __init__(self, calendar):

        super().__init__()
        self._calendar = calendar

        calendar.tagsUpdated.connect(self.create)

    def create(self):

        self.beginResetModel()
        self.clear()

        for key in self._calendar.tags.keys():
            nameItem = QStandardItem(key)
            self.invisibleRootItem().appendRow(nameItem)

        self.setHorizontalHeaderLabels(['name'])
        self.endResetModel()
