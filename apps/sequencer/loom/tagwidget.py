from PySide6.QtWidgets import QTreeView


from PySide6.QtWidgets import QLineEdit

from _common import Icon

from .calendar import Calendar
from .tagmodel import TagModel


class TagWidget(QTreeView):

    def __init__(self):

        super().__init__()

        self.setRootIsDecorated(False)

        self.setModel(TagModel.the)
        TagModel.the.modelReset.connect(self.modelUpdate)

    def modelUpdate(self):

        self.resizeColumnToContents(0)

    def addControls(self, mainWindow):

        tagToolBar = mainWindow.addToolBar('Tags')
        tagToolBar.setObjectName('Tags')
        tagToolBar.setMovable(False)

        self.tagEdit = QLineEdit()
        self.tagEdit.setStyleSheet("color: #ff0000")
        self.tagEdit.textChanged.connect(self._checkTag)
        self.tagEdit.returnPressed.connect(self._add)
        tagToolBar.addWidget(self.tagEdit)

        self.addAction = tagToolBar.addAction(Icon.app('new_tag'), 'Add Tag', self._add)
        self.addAction.setEnabled(False)

        tagToolBar.addAction(Icon.app('delete_tag'), 'Remove Remove', self._remove)

        tagToolBar.addSeparator()

    def _add(self):

        tag = self.tagEdit.text()

        if not tag in Calendar.the.tags:
            Calendar.the.tags[tag] = dict()
            Calendar.the.tagsUpdated.emit()

        self._checkTag()

    def _remove(self):

        indices = self.selectionModel().selectedRows()
        if not indices:
            return

        row = indices[0].row()
        item = Calendar.the.item(row, 0)

        tag = item.text()
        del Calendar.the.tags[tag]

        Calendar.the.tagsUpdated.emit()
        self._checkTag()

    def _checkTag(self):

        tag = self.tagEdit.text()

        if tag in Calendar.the.tags:
            self.tagEdit.setStyleSheet("color: #ff0000")
            self.addAction.setEnabled(False)
        else:
            self.tagEdit.setStyleSheet("color: #000000")
            self.addAction.setEnabled(True)
