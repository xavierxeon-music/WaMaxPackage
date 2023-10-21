from PySide6.QtGui import QStandardItemModel

from PySide6.QtGui import QStandardItem

from .calendar import Calendar


class TagModel(QStandardItemModel):

    the = None

    def __init__(self):

        super().__init__()
        TagModel.the = self

        Calendar.the.tagsUpdated.connect(self.create)

    def create(self):

        self.beginResetModel()
        self.clear()

        for key in Calendar.the.tags.keys():
            nameItem = QStandardItem(key)
            self.invisibleRootItem().appendRow(nameItem)

        self.setHorizontalHeaderLabels(['name'])
        self.endResetModel()
