from PySide6.QtWidgets import QTreeView

import os

from PySide6.QtWidgets import QAbstractItemView, QLineEdit
from PySide6.QtGui import QIcon

from .timepointmodel import TimePointModel


class TimePointView(QTreeView):

    def __init__(self, timeline):

        super().__init__()
        self._model = TimePointModel(timeline)
        self.setModel(self._model)

        self.setRootIsDecorated(False)
        self.setSelectionMode(QAbstractItemView.SingleSelection)
        self._model.modelReset.connect(self.modelUpdate)
        self.clicked.connect(self._itemClicked)

    def modelUpdate(self):

        self.resizeColumnToContents(0)
        self.resizeColumnToContents(1)

    def addControls(self, mainWindow):

        iconPath = os.path.dirname(__file__) + '/icons/'

        self.timePointEdit = QLineEdit()
        self.timePointEdit.setStyleSheet("color: #ff0000")
        self.timePointEdit.textChanged.connect(self._checkTimeLine)

        editToolBar = mainWindow.addToolBar('TimePoint')
        editToolBar.setObjectName('TimePoint')
        editToolBar.setMovable(False)

        editToolBar.addWidget(self.timePointEdit)
        self.addAction = editToolBar.addAction(QIcon(iconPath + 'new.svg'), 'Add TimePoint', self.add)
        self.addAction.setEnabled(False)

        editToolBar.addAction(QIcon(iconPath + 'load.svg'), 'Remove TimePoint', self.remove)

    def add(self):

        timePoint = self.timePointEdit.text()
        self._model._timeline.add(timePoint)

        self._checkTimeLine()

    def remove(self):

        indices = self.selectionModel().selectedRows()
        if not indices:
            return

        row = indices[0].row()

        item = self._model.item(row, 0)
        timePoint = item.text()

        self._model._timeline.remove(timePoint)
        self._checkTimeLine()

    def _checkTimeLine(self):

        timePoint = self.timePointEdit.text()

        if self._model.isValidTimePoint(timePoint):
            self.timePointEdit.setStyleSheet("color: #000000")
            self.addAction.setEnabled(True)
        else:
            self.timePointEdit.setStyleSheet("color: #ff0000")
            self.addAction.setEnabled(False)

    def _itemClicked(self, index):

        row = index.row()

        item = self._model.item(row, 0)
        timePoint = item.text()

        self._model._timeline.setCurrent(timePoint)
