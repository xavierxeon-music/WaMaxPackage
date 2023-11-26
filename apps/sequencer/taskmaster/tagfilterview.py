from PySide6.QtWidgets import QTreeView

from .tagmodel import TagModel


class TagFilterView(QTreeView):

   def __init__(self):

      super().__init__()
      self._model = TagModel()

      self.setModel(self._model)

   def addControls(self, mainWindow):

      pass
