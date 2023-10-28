from PySide6.QtWidgets import QDialog

from PySide6.QtCore import Qt
from PySide6.QtWidgets import QTreeView, QToolBar, QVBoxLayout, QLineEdit

from _common import Icon

from .calendar import Calendar
from .tagmodel import TagModel


class TagDialog(QDialog):

    def __init__(self):

        super().__init__()
        self.setWindowTitle('Pulsar Editor - Tags')

        toolBar = QToolBar()
        toolBar.setFloatable(False)
        toolBar.addSeparator()  # acts a s spacer, but is ugly

        self.tagEdit = QLineEdit()
        self.tagEdit.setStyleSheet("color: #ff0000")
        self.tagEdit.textChanged.connect(self._checkTag)
        self.tagEdit.returnPressed.connect(self._add)
        toolBar.addWidget(self.tagEdit)

        self.addAction = toolBar.addAction(Icon.common('new'), 'Add Tag', self._add)
        self.addAction.setEnabled(False)

        toolBar.addAction(Icon.common('delete'), 'Remove Remove', self._remove)

        self.tagView = QTreeView()
        self.tagView.setRootIsDecorated(False)

        self.tagView.setModel(TagModel.the)
        TagModel.the.modelReset.connect(self.modelUpdate)

        masterLayout = QVBoxLayout()
        masterLayout.setContentsMargins(0, 0, 0, 0)
        masterLayout.setSpacing(0)

        masterLayout.addWidget(toolBar)
        masterLayout.addWidget(self.tagView)

        self.setLayout(masterLayout)

    def modelUpdate(self):

        self.tagView.resizeColumnToContents(0)

    def _add(self):

        tag = self.tagEdit.text()

        if not tag in Calendar.the.tags:
            Calendar.the.tags[tag] = dict()
            Calendar.the.tagsUpdated.emit()

        self._checkTag()

    def _remove(self):

        indices = self.tagView.selectionModel().selectedRows()
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
