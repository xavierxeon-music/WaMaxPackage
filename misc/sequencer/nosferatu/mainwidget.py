from _common import SingeltonWindow

import os

from PySide6.QtCore import Qt
from PySide6.QtGui import QIcon,  QKeySequence
from PySide6.QtWidgets import QDockWidget, QWidget, QFileDialog, QCheckBox


from .velocityview import VelocityView
from .noteview import NoteView
from .startview import StartView
from .timeline import TimeLine


class MainWidget(SingeltonWindow):

    def __init__(self):

        super().__init__('nosferatu_editor')
        self.setWindowTitle(f'Nosferatu Cell Editor [*]')

        self._currentFile = ''
        self._timeline = TimeLine()
        self._timeline.sequenceUpdated.connect(self._dataModified)

        self._startView = StartView(self._timeline)
        self._addDockWidget(self._startView, 'Start', Qt.LeftDockWidgetArea)

        self._eventView = VelocityView(self._timeline)
        self._addDockWidget(self._eventView, 'Event', Qt.RightDockWidgetArea)

        self._noteView = NoteView(self._timeline)
        self.setCentralWidget(self._noteView)

        self._addControls()

    def loadFile(self, fileName):

        if not self._timeline.load(fileName):
            return

        self._currentFile = fileName
        self.setWindowTitle(f'Nosferatu Editor - {fileName} [*]')
        self.setWindowModified(False)

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

        self.asNotesCheck = QCheckBox('as note')
        self.asNotesCheck.clicked.connect(self._timeline.setAsNotes)

        editToolBar = self.addToolBar('Edit')
        editToolBar.setObjectName('Edit')
        editToolBar.setMovable(False)
        editToolBar.addAction(QIcon(iconPath + 'new.svg'), 'Add', self._startView .add)
        editToolBar.addAction(QIcon(iconPath + 'load.svg'), 'Remove', self._startView .remove)
        editToolBar.addWidget(self.asNotesCheck)

        fileMenu = self.menuBar().addMenu('File')
        fileMenu.addAction('New', self.load)
        fileMenu.addAction('Load', self.load)

        fileMenu.addSeparator()
        fileMenu.addAction(QIcon(iconPath + 'save.svg'), 'Save', self.save)
        quickSaveAction = fileMenu.addAction('QuickSave', self._quickSave)
        quickSaveAction.setShortcut(QKeySequence(QKeySequence.Save))
