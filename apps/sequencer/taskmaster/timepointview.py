from PySide6.QtWidgets import QTreeView

from PySide6.QtCore import QSortFilterProxyModel, Qt
from PySide6.QtWidgets import QAbstractItemView, QLineEdit

from _common import TimePoint, Icon

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

   def addControls(self, mainWindow):

      self.timePointEdit = QLineEdit()
      self.timePointEdit.setStyleSheet("color: #ff0000")
      # self.timePointEdit.textChanged.connect(self._checkTimeLine)
      self.timePointEdit.returnPressed.connect(self._add)

      editToolBar = mainWindow.addToolBar('TimePoint')
      editToolBar.setObjectName('TimePoint')
      editToolBar.setMovable(False)

      editToolBar.addWidget(self.timePointEdit)
      self.addAction = editToolBar.addAction(Icon.common('new'), 'Add Pattern', self._add)
      self.addAction.setEnabled(False)

      editToolBar.addAction(Icon.common('delete'), 'Remove Pattern', self._remove)

      editToolBar.addSeparator()

   def _itemClicked(self, index):

      row = index.row()

      item = self._model.item(row, 0)
      timePoint = item.text()

      Calender.the.setCurrent(timePoint)

   def _add(self):

      print('add timepoint')

   def _remove(self):

      print('remove timepoint')
