from _common import SingeltonWindow

import os

from PySide6.QtCore import Qt
from PySide6.QtGui import QIcon,  QKeySequence
from PySide6.QtWidgets import QDockWidget, QWidget, QFileDialog, QLabel, QCheckBox, QSpinBox


from .eventdata import EventData
from .eventview import EventView
from .noteview import NoteView


class MainWidgetCell(SingeltonWindow):

    def __init__(self):

        super().__init__('nosferatu_editor')
        self.setWindowTitle(f'Nosferatu Cell Editor [*]')

        self._currentFile = ''
        self._eventData = EventData()
        self._eventData.updated.connect(self._dataModified)

        self._eventView = EventView(self._eventData)

        dockWidget = QDockWidget()
        dockWidget.setObjectName('Event')
        dockWidget.setWidget(self._eventView)
        dockWidget.setTitleBarWidget(QWidget())
        dockWidget.setFeatures(QDockWidget.NoDockWidgetFeatures)
        self.addDockWidget(Qt.RightDockWidgetArea, dockWidget)

        self._noteView = NoteView(self._eventData)
        self.setCentralWidget(self._noteView)

        self._addControls()

    def loadFile(self, fileName):

        self._currentFile = fileName
        self.setWindowTitle(f'Nosferatu Editor - {fileName} [*]')
        self._eventData.load(fileName)
        self.setWindowModified(False)

        self.asNotesCheck.blockSignals(True)
        self.asNotesCheck.setChecked(self._eventData.asNotes)
        self.asNotesCheck.blockSignals(False)

        self.lengthSpin.blockSignals(True)
        self.lengthSpin.setValue(self._eventData.length)
        self.lengthSpin.blockSignals(False)

    def saveFile(self, fileName):

        self._currentFile = fileName
        self.setWindowTitle(f'Nosferatu Cell Editor - {fileName} [*]')
        self._eventData.save(fileName)
        self.setWindowModified(False)

    def load(self):

        loadLocation = QFileDialog.getOpenFileName(self, 'Nosferatu Cell File', str(), '*.json')
        if not loadLocation:
            return

        fileName = loadLocation[0]
        self.loadFile(fileName)

    def save(self):

        saveLocation = QFileDialog.getSaveFileName(self, 'Nosferatu Cell File', self._currentFile, '*.json')
        if not saveLocation:
            return

        fileName = saveLocation[0]
        self.saveFile(fileName)

    def _quickSave(self):

        if not self._currentFile:
            return

        self._eventData.save(self._currentFile)
        self.setWindowModified(False)

    def _dataModified(self):

        self.setWindowModified(True)

    def _addControls(self):

        iconPath = os.path.dirname(__file__) + '/icons/'

        fileToolBar = self.addToolBar('File')
        fileToolBar.setObjectName('File')
        fileToolBar.setMovable(False)
        fileToolBar.addAction(QIcon(iconPath + 'new.svg'), 'New', self.load)
        fileToolBar.addAction(QIcon(iconPath + 'load.svg'), 'Load', self.load)
        fileToolBar.addAction(QIcon(iconPath + 'save.svg'), 'Save', self.save)

        self.asNotesCheck = QCheckBox('as note')
        self.asNotesCheck.clicked.connect(self._eventData.setAsNotes)

        self.lengthSpin = QSpinBox()
        self.lengthSpin.setRange(1, 256)

        def updateLength():

            value = self.lengthSpin.value()
            self._eventData.setLength(value)

        self.lengthSpin.editingFinished.connect(updateLength)

        lengthLabel = QLabel('length')

        editToolBar = self.addToolBar('Edit')
        editToolBar.setObjectName('Edit')
        editToolBar.addWidget(self.asNotesCheck)
        editToolBar.addWidget(self.lengthSpin)
        editToolBar.addWidget(lengthLabel)

        fileMenu = self.menuBar().addMenu('File')
        quickSaveAction = fileMenu.addAction('QuickSave', self._quickSave)
        quickSaveAction.setShortcut(QKeySequence(QKeySequence.Save))
