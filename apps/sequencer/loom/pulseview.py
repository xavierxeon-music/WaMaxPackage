from PySide6.QtWidgets import QTreeView

import os

from PySide6.QtWidgets import QAbstractItemView, QLineEdit, QComboBox
from PySide6.QtCore import Qt
from PySide6.QtGui import QIcon

from _common import Icon

from .calendar import Calendar
from .pulsemodel import PusleModel, PulseSortModel
from .patterndelegate import PatternDelegate
from .tagdialog import TagDialog
from .tagmodel import TagModel
from .pattern import Pattern


class PulseView(QTreeView):

    def __init__(self):

        super().__init__()

        self._model = PusleModel()

        self._proxyModel = PulseSortModel(self._model)
        self.setModel(self._proxyModel)

        self.setRootIsDecorated(False)
        self.setSelectionMode(QAbstractItemView.SingleSelection)
        self.setSortingEnabled(True)

        self.setItemDelegateForColumn(3, PatternDelegate())

        TagModel.the.modelReset.connect(self.modelUpdate)
        Calendar.the.beatCountChange.connect(self.modelUpdate)
        Calendar.the.loaded.connect(self.modelUpdate)

        self._clipboard = None

    def modelUpdate(self):

        self.resizeColumnToContents(0)
        self.resizeColumnToContents(1)
        self.resizeColumnToContents(2)
        self.resizeColumnToContents(3)

        self.sortByColumn(0, Qt.AscendingOrder)

    def addControls(self, mainWindow):

        self.timePointEdit = QLineEdit()
        self.timePointEdit.setStyleSheet("color: #ff0000")
        self.timePointEdit.textChanged.connect(self._checkTimeLine)
        self.timePointEdit.returnPressed.connect(self._add)

        self.tagSelectCombo = QComboBox()
        self.tagSelectCombo.setModel(TagModel.the)
        self.tagSelectCombo.currentIndexChanged.connect(self._checkTimeLine)

        editToolBar = mainWindow.addToolBar('TimePoint')
        editToolBar.setObjectName('TimePoint')
        editToolBar.setMovable(False)

        editToolBar.addWidget(self.timePointEdit)
        editToolBar.addWidget(self.tagSelectCombo)
        self.addAction = editToolBar.addAction(Icon.common('new'), 'Add Pattern', self._add)
        self.addAction.setEnabled(False)

        editToolBar.addAction(Icon.common('delete'), 'Remove Pattern', self._remove)

        editToolBar.addSeparator()

        editToolBar.addAction(Icon.common('copy'), 'Copy Pattern', self._copy)
        editToolBar.addAction(Icon.common('paste'), 'Paste Pattern', self._paste)
        editToolBar.addAction(Icon.common('clear'), 'Clear Pattern', self._clear)

        editToolBar.addSeparator()

        editToolBar.addAction(Icon.app('tags'), 'Edit Tags', self._editTags)

    def _add(self):

        timePoint = self.timePointEdit.text()
        tag = self.tagSelectCombo.currentText()

        if Calendar.the.available(tag, timePoint):
            Calendar.the.add(tag, timePoint)

        self._checkTimeLine()

    def _remove(self):

        timePoint, tag = self._selectedTimePointAndTag()
        if not timePoint:
            return

        Calendar.the.remove(tag, timePoint)

        self._checkTimeLine()

    def _copy(self):

        timePoint, tag = self._selectedTimePointAndTag()
        if not timePoint:
            return

        pattern = Calendar.the.tags[tag][timePoint]
        self._clipboard = pattern.copy()

    def _paste(self):

        if not self._clipboard:
            return

        timePoint, tag = self._selectedTimePointAndTag()
        if not timePoint:
            return

        pattern = Calendar.the.tags[tag][timePoint]
        pattern.paste(self._clipboard)

        self._clipboard = None
        Calendar.the.loaded.emit()
        Calendar.the.beatModified.emit()

    def _clear(self):

        timePoint, tag = self._selectedTimePointAndTag()
        if not timePoint:
            return

        Calendar.the.tags[tag][timePoint] = Pattern()
        Calendar.the.loaded.emit()
        Calendar.the.beatModified.emit()

    def _checkTimeLine(self):

        tag = self.tagSelectCombo.currentText()
        timePoint = self.timePointEdit.text()

        if Calendar.the.available(tag, timePoint):
            self.timePointEdit.setStyleSheet("color: #000000")
            self.addAction.setEnabled(True)
        else:
            self.timePointEdit.setStyleSheet("color: #ff0000")
            self.addAction.setEnabled(False)

    def _editTags(self):

        dlg = TagDialog()
        dlg.exec()

    def _selectedTimePointAndTag(self):

        indices = self.selectionModel().selectedRows()
        if not indices:
            return [None, None]

        orgIndex = self._proxyModel.mapToSource(indices[0])
        row = orgIndex.row()

        timePointItem = self._model.item(row, 0)
        timePoint = timePointItem.text()

        tagItem = self._model.item(row, 1)
        tag = tagItem.text()

        return [timePoint, tag]
