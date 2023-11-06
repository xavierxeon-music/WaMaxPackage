from _common import SingeltonWindow


from PySide6.QtCore import Qt
from PySide6.QtGui import QIcon, QKeySequence
from PySide6.QtWidgets import QWidget, QFileDialog, QCheckBox, QLineEdit

from _common import Icon


class TaskmasterMainWidget(SingeltonWindow):

    def __init__(self):

        super().__init__('Taskmaster_editor')
        self.setWindowTitle('Taskmaster Editor [*]')

        self._currentFile = ''
        self._addControls()

    def loadFile(self, fileName):

        loaded = False
        # loaded = self._loom.load(fileName)
        # if not loaded:
        # self._loom.clear()

        self._currentFile = fileName
        self.setWindowTitle(f'Taskmaster Editor - {fileName} [*]')
        self.setWindowModified(not loaded)

    def saveFile(self, fileName):

        # self._loom.save(fileName)

        self._currentFile = fileName
        self.setWindowTitle(f'Taskmaster Editor - {fileName} [*]')
        self.setWindowModified(False)

    def load(self):

        loadLocation = QFileDialog.getOpenFileName(self, 'Taskmaster File', str(), '*.json')
        if not loadLocation:
            return

        fileName = loadLocation[0]
        self.loadFile(fileName)

    def save(self):

        saveLocation = QFileDialog.getSaveFileName(self, 'Taskmaster File', self._currentFile, '*.json')
        if not saveLocation:
            return

        fileName = saveLocation[0]
        self.saveFile(fileName)

    def newFile(self):

        self._loom.clear()

        self._currentFile = ''
        self.setWindowModified(False)

    def _quickSave(self):

        if not self._currentFile:
            return

        self._loom.save(self._currentFile)
        self.setWindowModified(False)

    def _dataModified(self):

        self.setWindowModified(True)

    def _addControls(self):

        pass
