from _common import SingeltonWindow

import os

from PySide6.QtCore import Qt
from PySide6.QtGui import QIcon, QKeySequence
from PySide6.QtWidgets import QWidget, QFileDialog, QCheckBox, QLineEdit

from _common import icon

from .calendar import Calendar
from .pulseview import PulseView


class PulsarMainWidget(SingeltonWindow):

    def __init__(self):

        super().__init__('pulsar_editor')
        self.setWindowTitle('Pulsar Editor [*]')

        self._currentFile = ''
        self._calendar = Calendar()
        self._calendar.updated.connect(self._dataModified)

        self._pulseVieww = PulseView()
        self.setCentralWidget(self._pulseVieww)

        self._addControls()

    def loadFile(self, fileName):

        self._currentFile = fileName
        self._calendar.load(fileName)

        self.setWindowModified(False)

    def saveFile(self, fileName):

        self._currentFile = fileName
        self._calendar.save(fileName)

        self.setWindowModified(False)

    def load(self):

        loadLocation = QFileDialog.getOpenFileName(self, 'Pulsar File', str(), '*.json')
        if not loadLocation:
            return

        fileName = loadLocation[0]
        self.loadFile(fileName)

    def save(self):

        saveLocation = QFileDialog.getSaveFileName(self, 'Pulsar File', self._currentFile, '*.json')
        if not saveLocation:
            return

        fileName = saveLocation[0]
        self.saveFile(fileName)

    def newFile(self):

        pass

    def _quickSave(self):

        if not self._currentFile:
            return

        self._timeline.save(self._currentFile)
        self.setWindowModified(False)

    def _dataModified(self):

        self.setWindowModified(True)

    def _addControls(self):

        # widgets
        fileToolBar = self.addToolBar('File')
        fileToolBar.setObjectName('File')
        fileToolBar.setMovable(False)

        self._pulseVieww.addControls(self)

        settingsToolBar = self.addToolBar('Settings')
        settingsToolBar.setObjectName('Settings')
        settingsToolBar.setMovable(False)

        fileMenu = self.menuBar().addMenu('File')
        fileMenu.addAction('New', self.newFile)
        fileMenu.addAction('Load', self.load)

        # actions
        fileToolBar.addAction(icon('save'), 'Save', self._quickSave)
        fileToolBar.addSeparator()

        fileMenu.addSeparator()
        fileMenu.addAction('Save', self.save)
        quickSaveAction = fileMenu.addAction(icon('save'), 'QuickSave', self._quickSave)
        quickSaveAction.setShortcut(QKeySequence(QKeySequence.Save))
