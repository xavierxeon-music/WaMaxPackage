from PySide6.QtWidgets import QMainWindow

from PySide6.QtCore import QSettings, Qt
from PySide6.QtGui import QIcon
from PySide6.QtWidgets import QDockWidget, QWidget, QFileDialog
from PySide6.QtNetwork import QLocalServer, QLocalSocket


from .eventdata import EventData
from .eventview import EventView
from .noteview import NoteView


class MainWidget(QMainWindow):

    def __init__(self):

        super().__init__()
        self.setWindowTitle(f'Nosferatu Editor [*]')

        self._server = None
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

        fileToolBar = self.addToolBar('File')
        fileToolBar.setObjectName('File')
        fileToolBar.setMovable(False)
        fileToolBar.addAction(QIcon(), 'Load', self.load)
        fileToolBar.addAction(QIcon(), 'Save', self.save)

        qtsettings = QSettings()
        self.restoreGeometry(qtsettings.value('geometry'))
        self.restoreState(qtsettings.value('state'))

    def __del__(self):

        if self._server:
            self._server.close()

    def closeEvent(self, event):

        qtsettings = QSettings()
        qtsettings.setValue('geometry', self.saveGeometry())
        qtsettings.setValue('state', self.saveState())

        super().closeEvent(event)

    def singletonLoad(self, fileName):

        _socketName = "nosferatu_editor"

        socket = QLocalSocket()
        socket.connectToServer(_socketName)
        if socket.waitForConnected():  # found server
            socket.write(fileName.encode())
            socket.waitForBytesWritten()
            return False
        elif not self._server:
            self._server = QLocalServer()
            self._server.newConnection.connect(self._serverConnected)
            self._server.listen(_socketName)

        self.loadFile(fileName)
        return True

    def _serverConnected(self):
        socket = self._server.nextPendingConnection()
        socket.waitForReadyRead()
        fileName = bytes(socket.readAll()).decode()
        self.loadFile(fileName)

    def loadFile(self, fileName):

        self._currentFile = fileName
        self.setWindowTitle(f'Nosferatu Editor - {fileName} [*]')
        self._eventData.load(fileName)
        self.setWindowModified(False)

    def saveFile(self, fileName):

        self._currentFile = fileName
        self.setWindowTitle(f'Nosferatu Editor - {fileName} [*]')
        self._eventData.save(fileName)
        self.setWindowModified(False)

    def load(self):

        loadLocation = QFileDialog.getOpenFileName(self, 'Nosferatu File', str(), '*.json')
        if not loadLocation:
            return

        fileName = loadLocation[0]
        self.loadFile(fileName)

    def save(self):

        saveLocation = QFileDialog.getSaveFileName(self, 'Nosferatu File', self._currentFile, '*.json')
        if not saveLocation:
            return

        fileName = saveLocation[0]
        self.saveFile(fileName)

    def _dataModified(self):

        self.setWindowModified(True)
