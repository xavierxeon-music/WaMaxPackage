from PySide6.QtWidgets import QTableView

from PySide6.QtWidgets import QAbstractItemView

from .notemodel import NoteModel


class NoteView(QTableView):

    def __init__(self, eventData):

        super().__init__()
        self._model = NoteModel(eventData)
        self.setModel(self._model)

        self.horizontalHeader().hide()
        self._model.modelReset.connect(self.modelUpdate)
        self.clicked.connect(self._model.toggle)
        self.setSelectionMode(QAbstractItemView.NoSelection)

    def modelUpdate(self):

        colCount = self.model().columnCount()
        for col in range(colCount):
            self.setColumnWidth(col, 30)
