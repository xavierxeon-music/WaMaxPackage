from PySide6.QtWidgets import QTreeView

from .eventmodel import EventModel


class EventView(QTreeView):

    def __init__(self):

        super().__init__()
        self._model = EventModel()

        self.setModel(self._model)
