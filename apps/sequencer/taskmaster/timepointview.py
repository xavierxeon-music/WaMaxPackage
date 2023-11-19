from PySide6.QtWidgets import QTreeView

from PySide6.QtCore import QSortFilterProxyModel, Qt
from PySide6.QtWidgets import QAbstractItemView

from _common import TimePoint

from .timepointmodel import TimePointModel
from .calendar import Calender


class TimePointSortModel(QSortFilterProxyModel):

    def __init__(self, timeModel):

        super().__init__()
        self._timeModel = timeModel
        self.setSourceModel(timeModel)

    def lessThan(self, leftIndex, rightIndex):

        leftData = self.sourceModel().data(leftIndex)
        rightData = self.sourceModel().data(rightIndex)

        tpLeft = TimePoint(leftData)
        tpRight = TimePoint(rightData)

        return tpLeft < tpRight


class TimePointView(QTreeView):

    def __init__(self):

        super().__init__()
        self._model = TimePointModel()

        self._proxyModel = TimePointSortModel(self._model)
        self.setModel(self._proxyModel)

        self.setRootIsDecorated(False)
        self.setSelectionMode(QAbstractItemView.SingleSelection)
        self.setSortingEnabled(True)

        self._model.modelReset.connect(self.modelUpdate)
        self.clicked.connect(self._itemClicked)

    def modelUpdate(self):

        self.resizeColumnToContents(0)
        self.resizeColumnToContents(1)
        self.sortByColumn(0, Qt.AscendingOrder)

    def _itemClicked(self, index):

        row = index.row()

        item = self._model.item(row, 0)
        timePoint = item.text()

        Calender.the.setCurrent(timePoint)
