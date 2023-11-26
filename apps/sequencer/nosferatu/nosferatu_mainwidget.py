from _common import SingeltonWindow

from PySide6.QtCore import Qt
from PySide6.QtGui import QKeySequence
from PySide6.QtWidgets import QFileDialog, QCheckBox

from _common import Icon

from .velocityview import VelocityView
from .noteview import NoteView
from .timepointview import TimePointView
from .timeline import TimeLine


class NosferatuMainWidget(SingeltonWindow):

   def __init__(self):

      super().__init__()

      self._timeline = TimeLine()
      self._timeline.sequenceUpdated.connect(self.dataModified)

      self._timePointView = TimePointView()
      self.addAndCreateDockWidget(self._timePointView, 'Start', Qt.LeftDockWidgetArea)

      self._eventView = VelocityView()
      self.addAndCreateDockWidget(self._eventView, 'Event', Qt.RightDockWidgetArea)

      self._noteView = NoteView()
      self.setCentralWidget(self._noteView)

      self._addControls()

   def loadFile(self, fileName):

      loaded = self._timeline.load(fileName)
      if not loaded:
         self._timeline.clear()

      self.updateWindowTitle(not loaded, fileName)

      self.asNotesCheck.blockSignals(True)
      self.asNotesCheck.setChecked(self._timeline.asNotes)
      self.asNotesCheck.blockSignals(False)

   def saveFile(self, fileName):

      self._timeline.save(fileName)

      self.updateWindowTitle(False, fileName)

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

   def _quickSave(self):

      if not self._currentFile:
         return

      self._timeline.save(self._currentFile)
      self.setWindowModified(False)

   def _addControls(self):

      # widgets
      self.asNotesCheck = QCheckBox('as note')
      self.asNotesCheck.clicked.connect(self._timeline.setAsNotes)

      fileToolBar = self.addToolBar('File')
      fileToolBar.setObjectName('File')
      fileToolBar.setMovable(False)

      # actions
      fileToolBar.addAction(Icon.common('save'), 'Save', self._quickSave)
      fileToolBar.addSeparator()

      self._timePointView.addControls(self)

      settingsToolBar = self.addToolBar('Settings')
      settingsToolBar.setObjectName('Settings')
      settingsToolBar.setMovable(False)

      settingsToolBar.addWidget(self.asNotesCheck)

      fileMenu = self.menuBar().addMenu('File')
      fileMenu.addAction('New', self.newFile)
      fileMenu.addAction('Load', self.load)

      fileMenu.addSeparator()
      fileMenu.addAction('Save', self.save)
      quickSaveAction = fileMenu.addAction(Icon.common('save'), 'QuickSave', self._quickSave)
      quickSaveAction.setShortcut(QKeySequence(QKeySequence.Save))
