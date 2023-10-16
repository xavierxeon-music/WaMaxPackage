from _common import SingeltonWindow

import os

from PySide6.QtCore import Qt
from PySide6.QtGui import QIcon, QKeySequence
from PySide6.QtWidgets import QDockWidget, QWidget, QFileDialog, QCheckBox, QLineEdit


from .velocityview import VelocityView
from .noteview import NoteView
from .timepointview import TimePointView
from .timeline import TimeLine


def icon(iconName):

    path = os.path.dirname(__file__) + '/icons/' + iconName + '.svg'
    return QIcon(path)


class MainWidget(SingeltonWindow):

    def __init__(self):

        super().__init__('nosferatu_editor')
        self.setWindowTitle(f'Nosferatu Cell Editor [*]')

        self._currentFile = ''
        self._timeline = TimeLine()
        self._timeline.sequenceUpdated.connect(self._dataModified)

        self._timePointView = TimePointView()
        self._addDockWidget(self._timePointView, 'Start', Qt.LeftDockWidgetArea)

        self._eventView = VelocityView()
        self._addDockWidget(self._eventView, 'Event', Qt.RightDockWidgetArea)

        self._noteView = NoteView()
        self.setCentralWidget(self._noteView)

        self._addControls()

    def loadFile(self, fileName):

        loaded = self._timeline.load(fileName)
        if not loaded:
            self._timeline.clear()

        self._currentFile = fileName
        self.setWindowTitle(f'Nosferatu Editor - {fileName} [*]')
        self.setWindowModified(not loaded)

        self.asNotesCheck.blockSignals(True)
        self.asNotesCheck.setChecked(self._timeline.asNotes)
        self.asNotesCheck.blockSignals(False)

    def saveFile(self, fileName):

        self._currentFile = fileName
        self.setWindowTitle(f'Nosferatu Cell Editor - {fileName} [*]')
        self._timeline.save(fileName)
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

    def newFile(self):

        self._currentFile = ''
        self._timeline.clear()

    def _addDockWidget(self, payload, name, area):

        dockWidget = QDockWidget()
        dockWidget.setObjectName(name)
        dockWidget.setWidget(payload)
        dockWidget.setTitleBarWidget(QWidget())
        dockWidget.setFeatures(QDockWidget.NoDockWidgetFeatures)
        self.addDockWidget(area, dockWidget)

    def _quickSave(self):

        if not self._currentFile:
            return

        self._timeline.save(self._currentFile)
        self.setWindowModified(False)

    def _dataModified(self):

        self.setWindowModified(True)

    def _addControls(self):

        iconPath = os.path.dirname(__file__) + '/icons/'

        # widgets
        self.asNotesCheck = QCheckBox('as note')
        self.asNotesCheck.clicked.connect(self._timeline.setAsNotes)

        fileToolBar = self.addToolBar('File')
        fileToolBar.setObjectName('File')
        fileToolBar.setMovable(False)

        self._timePointView.addControls(self)

        settingsToolBar = self.addToolBar('Settings')
        settingsToolBar.setObjectName('Settings')
        settingsToolBar.setMovable(False)

        fileMenu = self.menuBar().addMenu('File')
        fileMenu.addAction('New', self.newFile)
        fileMenu.addAction('Load', self.load)

        # actions
        fileToolBar.addAction(icon('save'), 'Save', self._quickSave)
        fileToolBar.addSeparator()

        settingsToolBar.addWidget(self.asNotesCheck)

        fileMenu.addSeparator()
        fileMenu.addAction('Save', self.save)
        quickSaveAction = fileMenu.addAction(icon('save'), 'QuickSave', self._quickSave)
        quickSaveAction.setShortcut(QKeySequence(QKeySequence.Save))
