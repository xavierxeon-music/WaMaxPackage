from _common import SingeltonWindow

import os

from PySide6.QtCore import Qt
from PySide6.QtGui import QIcon, QKeySequence
from PySide6.QtWidgets import QWidget, QFileDialog, QCheckBox, QLineEdit

from _common import icon

from .calendar import Calendar
from .pulseview import PulseView
from .tagmodel import TagModel


class PulsarMainWidget(SingeltonWindow):

    def __init__(self):

        super().__init__('pulsar_editor')
        self.setWindowTitle('Pulsar Editor [*]')

        self._currentFile = ''
        self._calendar = Calendar()
        self._calendar.beatModified.connect(self._dataModified)
        self._calendar.beatCountChange.connect(self._dataModified)

        self._tagModel = TagModel()

        self._pulseVieww = PulseView()
        self.setCentralWidget(self._pulseVieww)

        self._addControls()

    def loadFile(self, fileName):

        loaded = self._calendar.load(fileName)
        if not loaded:
            self._calendar.clear()

        self._currentFile = fileName
        self.setWindowTitle(f'Pulsar Editor - {fileName} [*]')
        self.setWindowModified(not loaded)

    def saveFile(self, fileName):

        self._calendar.save(fileName)

        self._currentFile = fileName
        self.setWindowTitle(f'Pulsar Editor - {fileName} [*]')
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

        self._calendar.clear()

        self._currentFile = ''
        self.setWindowModified(False)

    def _quickSave(self):

        if not self._currentFile:
            return

        self._calendar.save(self._currentFile)
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
