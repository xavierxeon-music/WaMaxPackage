from PySide6.QtWidgets import QTreeView

from .timepointmodel import TimePointModel


class TimePointView(QTreeView):

    def __init__(self, timeline):

        super().__init__()
        self._model = TimePointModel(timeline)
        self.setModel(self._model)

        self.setRootIsDecorated(False)
        self._model.modelReset.connect(self.modelUpdate)

    def modelUpdate(self):

        self.resizeColumnToContents(0)
        self.resizeColumnToContents(1)

    def add(self):

        print('add time')

    def remove(self):

        print('remove time')
