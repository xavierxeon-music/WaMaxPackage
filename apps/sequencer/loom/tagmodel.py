from PySide6.QtGui import QStandardItemModel

from PySide6.QtGui import QStandardItem

from .calendar import Calendar


class TagModel(QStandardItemModel):

    the = None

    def __init__(self):

        super().__init__()
        TagModel.the = self

        Calendar.the.tagsUpdated.connect(self._create)

    def _create(self):

        self.beginResetModel()
        self.clear()

        keyList = list(Calendar.the.tags.keys())
        keyList.sort()

        for key in keyList:
            nameItem = QStandardItem(key)
            self.invisibleRootItem().appendRow(nameItem)

        self.setHorizontalHeaderLabels(['name'])
        self.endResetModel()

    def setData(self, index, value, role):

        row = index.row()
        item = self.invisibleRootItem().child(row, 0)
        oldValue = item.text()

        if Calendar.the.changeTag(value, oldValue):
            result = super().setData(index, value, role)
            Calendar.the.tagsUpdated.emit()
            return result

        return False
