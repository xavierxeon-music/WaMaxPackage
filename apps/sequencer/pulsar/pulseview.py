from PySide6.QtWidgets import QTreeView

import os

from PySide6.QtWidgets import QAbstractItemView, QLineEdit, QComboBox
from PySide6.QtCore import QSortFilterProxyModel
from PySide6.QtGui import QIcon

from _common import icon

from .calendar import Calendar
from .pulsemodel import PusleModel
from .tagdialog import TagDialog


class PulseSortModel(QSortFilterProxyModel):

    def __init__(self, pulseModel):

        super().__init__()
        self._pulseModel = pulseModel
        self.setSourceModel(pulseModel)

    def lessThan(self, leftIndex, rightIndex):

        leftData = self.sourceModel().data(leftIndex)
        rightData = self.sourceModel().data(rightIndex)

        leftContent = leftData.split('.')
        rightContent = rightData.split('.')

        if leftContent[0] > rightContent[0]:
            return True
        elif leftContent[0] == rightContent[0]:
            if leftContent[1] > rightContent[1]:
                return True

        return False


class PulseView(QTreeView):

    def __init__(self):

        super().__init__()

        self._model = PusleModel()

        self._proxyModel = PulseSortModel(self._model)
        self.setModel(self._proxyModel)

        self.setRootIsDecorated(False)
        self.setSelectionMode(QAbstractItemView.SingleSelection)
        self.setSortingEnabled(True)

        self._model.modelReset.connect(self.modelUpdate)

        self._clipboard = None

    def modelUpdate(self):

        self.resizeColumnToContents(0)
        self.resizeColumnToContents(1)

    def addControls(self, mainWindow):

        self.timePointEdit = QLineEdit()
        self.timePointEdit.setStyleSheet("color: #ff0000")
        self.timePointEdit.textChanged.connect(self._checkTimeLine)

        self.tagSelectCombo = QComboBox()

        editToolBar = mainWindow.addToolBar('TimePoint')
        editToolBar.setObjectName('TimePoint')
        editToolBar.setMovable(False)

        editToolBar.addWidget(self.timePointEdit)
        editToolBar.addWidget(self.tagSelectCombo)
        self.addAction = editToolBar.addAction(icon('new'), 'Add TimePoint', self._add)
        self.addAction.setEnabled(False)

        editToolBar.addAction(icon('delete'), 'Remove TimePoint', self._remove)

        editToolBar.addSeparator()

        editToolBar.addAction(icon('copy'), 'Copy Sequence', self._copy)
        editToolBar.addAction(icon('paste'), 'Paste Sequence', self._paste)
        editToolBar.addAction(icon('clear'), 'Clear Sequence', self._clear)

        editToolBar.addSeparator()

        iconPath = os.path.dirname(__file__) + '/icons/'
        editToolBar.addAction(QIcon(iconPath + 'tags.svg'), 'Edit Tags', self._editTags)

    def _add(self):

        timePoint = self.timePointEdit.text()
        self._model._timeline.add(timePoint)

        self._checkTimeLine()

    def _remove(self):

        timePoint = self._selectedTimePoint()
        if not timePoint:
            return

        # TimeLine.the.remove(timePoint)
        # self._checkTimeLine()

    def _copy(self):

        timePoint = self._selectedTimePoint()
        if not timePoint:
            return

        # sequence = TimeLine.the.sequences[timePoint]
        # self._clipboard = sequence.copy()

    def _paste(self):

        if not self._clipboard:
            return

        timePoint = self._selectedTimePoint()
        if not timePoint:
            return

        # sequence = TimeLine.the.sequences[timePoint]
        # sequence.paste(self._clipboard)

        self._clipboard = None

    def _clear(self):

        timePoint = self._selectedTimePoint()
        if not timePoint:
            return

        # sequence = TimeLine.the.sequences[timePoint]
        # sequence.clear()

    def _checkTimeLine(self):

        timePoint = self.timePointEdit.text()

        if self._model.isValidTimePoint(timePoint):
            self.timePointEdit.setStyleSheet("color: #000000")
            self.addAction.setEnabled(True)
        else:
            self.timePointEdit.setStyleSheet("color: #ff0000")
            self.addAction.setEnabled(False)

    def _editTags(self):

        dlg = TagDialog()
        dlg.exec()

    def _selectedTimePoint(self):

        indices = self.selectionModel().selectedRows()
        if not indices:
            return None

        row = indices[0].row()

        item = self._model.item(row, 0)
        timePoint = item.text()

        return timePoint
