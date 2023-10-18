from PySide6.QtWidgets import QDialog

from PySide6.QtWidgets import QTreeView, QToolBar, QVBoxLayout

from _common import icon


class TagDialog(QDialog):

    def __init__(self):

        super().__init__()
        self.setWindowTitle('Pulsar Editor - Tags')

        toolBar = QToolBar()
        toolBar.addAction(icon('new'), 'Add Tag', self._add)
        toolBar.addAction(icon('delete'), 'Remove Remove', self._remove)

        self.tagView = QTreeView()

        masterLayout = QVBoxLayout()
        masterLayout.setContentsMargins(0, 0, 0, 0)
        masterLayout.addWidget(toolBar)
        masterLayout.addWidget(self.tagView)

        self.setLayout(masterLayout)

    def _add(self):

        pass

    def _remove(self):

        pass
