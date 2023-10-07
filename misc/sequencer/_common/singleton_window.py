from PySide6.QtWidgets import QMainWindow

import os

from PySide6.QtCore import QStandardPaths
from PySide6.QtCore import QSettings
from PySide6.QtNetwork import QLocalServer, QLocalSocket


class SingeltonWindow(QMainWindow):

    def __init__(self, socketName):

        super().__init__()

        self._server = None
        self._socketName = QStandardPaths.writableLocation(QStandardPaths.TempLocation) + '/' + socketName

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

        socket = QLocalSocket()
        socket.connectToServer(self._socketName)
        if socket.waitForConnected():  # found server
            # print('socket connected')
            socket.write(fileName.encode())
            socket.waitForBytesWritten()
            return False
        elif not self._server:
            # print('create server')
            if os.path.exists(self._socketName):
                os.remove(self._socketName)
            self._server = QLocalServer()
            self._server.newConnection.connect(self._serverConnected)
            self._server.listen(self._socketName)

        # print('load file locally', fileName)
        self.loadFile(fileName)
        return True

    def _serverConnected(self):
        socket = self._server.nextPendingConnection()
        socket.waitForReadyRead()
        fileName = bytes(socket.readAll()).decode()
        self.loadFile(fileName)

    def loadFile(self, fileName):

        pass
