from PySide6.QtWidgets import QMainWindow

import sys

from PySide6.QtCore import QSettings
from PySide6.QtWidgets import QTextEdit
from PySide6.QtNetwork import QLocalServer, QLocalSocket


class MainWidget(QMainWindow):

    def __init__(self):

        super().__init__()
        self._server = None

        self.rawView = QTextEdit('Hello')
        self.setCentralWidget(self.rawView)

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

        def serverConnected():
            socket = self._server.nextPendingConnection()
            socket.waitForReadyRead()
            fileName = bytes(socket.readAll()).decode()
            self.load(fileName)

        socket = QLocalSocket()
        socket.connectToServer(_socketName)
        if socket.waitForConnected():  # found server
            socket.write(fileName.encode())
            socket.waitForBytesWritten()
            return False
        elif not self._server:
            self._server = QLocalServer()
            self._server.newConnection.connect(serverConnected)
            self._server.listen(_socketName)

        self.load(fileName)
        return True

    def load(self, fileName):

        self.setWindowTitle(f'Nosferatu Editor [{fileName}]')

        with open(fileName, 'r') as infile:
            text = infile.read()

        self.rawView.setPlainText(text)
