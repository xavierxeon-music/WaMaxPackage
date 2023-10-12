from PySide6.QtWidgets import QTreeView

from .veclocitymodel import VelocityModel


class VelocityView(QTreeView):

    def __init__(self, timeline):

        super().__init__()
        self._model = VelocityModel(timeline)
        self.setModel(self._model)
        self._model.modelReset.connect(self.modelUpdate)

    def modelUpdate(self):

        self.resizeColumnToContents(0)
        self.resizeColumnToContents(1)
