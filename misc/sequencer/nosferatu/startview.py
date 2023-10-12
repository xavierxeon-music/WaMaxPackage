from PySide6.QtWidgets import QTreeView

from .startmodel import StartModel


class StartView(QTreeView):

    def __init__(self, timeline):

        super().__init__()
        self._model = StartModel(timeline)
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
