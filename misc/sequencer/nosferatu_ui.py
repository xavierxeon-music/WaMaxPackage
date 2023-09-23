#!/usr/bin/env python3

import signal
import sys

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QApplication
from PySide6.QtNetwork import QLocalServer, QLocalSocket

from nosferatu import MainWidget


def signit_handler(*args):

    QApplication.quit()


def main():

    app = QApplication([])

    app.setOrganizationName('Schweinesystem')
    app.setOrganizationDomain('schweinesystem.eu')
    app.setApplicationName('Nosferatu Editor Tool')

    signal.signal(signal.SIGINT, signit_handler)
    timer = QTimer()
    timer.start(500)
    timer.timeout.connect(lambda: None)  # Let the interpreter run each 500 ms.

    fileName = ' '.join(sys.argv[1:])
    index = fileName.index(':')
    if index >= 0:
        fileName = fileName[index+1:]

    socketName = 'nosfertu_editor'

    socket = QLocalSocket()
    socket.connectToServer(socketName)
    if socket.waitForConnected():  # found server
        socket.write(fileName.encode())
        socket.waitForBytesWritten()
        return 0

    mainWindow = MainWidget(fileName)

    server = QLocalServer()

    def serverConnected():
        socket = server.nextPendingConnection()
        socket.waitForReadyRead()
        fileName = bytes(socket.readAll()).decode()
        mainWindow.load(fileName)

    server.newConnection.connect(serverConnected)
    server.listen(socketName)

    mainWindow.show()

    status = app.exec()
    server.close()

    sys.exit(status)


if __name__ == '__main__':
    main()
