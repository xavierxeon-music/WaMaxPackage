from PySide6.QtWidgets import QTreeView

from .eventmodel import EventModel


class EventView(QTreeView):

    def __init__(self, eventData):

        super().__init__()
        self._model = EventModel(eventData)
        self.setModel(self._model)
