from PySide6.QtWidgets import QTreeView

from PySide6.QtWidgets import QComboBox

from _common import Icon

from .eventmodel import EventModel


class EventView(QTreeView):

   def __init__(self):

      super().__init__()
      self._model = EventModel()

      self.setModel(self._model)

      self.setRootIsDecorated(False)

   def addControls(self, mainWindow):

      self.tagSelectCombo = QComboBox()
      # self.tagSelectCombo.setModel(TagModel.the)
      # self.tagSelectCombo.currentIndexChanged.connect(self._checkTimeLine)

      editToolBar = mainWindow.addToolBar('Event')
      editToolBar.setObjectName('Event')
      editToolBar.setMovable(False)

      editToolBar.addWidget(self.tagSelectCombo)
      self.addAction = editToolBar.addAction(Icon.common('new'), 'Add Pattern', self._add)
      self.addAction.setEnabled(False)

      editToolBar.addAction(Icon.common('delete'), 'Remove Pattern', self._remove)

      editToolBar.addSeparator()

   def _add(self):

      print('add event')

   def _remove(self):

      print('remove event')
