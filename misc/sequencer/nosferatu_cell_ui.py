#!/usr/bin/env python3

import platform
import signal
import sys

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QApplication

from nosferatu import MainWidgetCell


def signit_handler(*args):

    QApplication.quit()


def main():

    app = QApplication([])

    app.setOrganizationName('Schweinesystem')
    app.setOrganizationDomain('schweinesystem.eu')
    app.setApplicationName('Nosferatu Cell Editor')

    fileName = ' '.join(sys.argv[1:])
    if 'Darwin' == platform.system():
        index = fileName.find(':')
        if index >= 0:
            frontPart = fileName[:index]
            if not frontPart.startswith('/Volumes'):
                frontPart = '/Volumes/' + frontPart
            endPart = fileName[index+1:]
            fileName = frontPart + endPart

    mainWindow = MainWidgetCell()
    if not mainWindow.singletonLoad(fileName):  # other instance of application is running
        print("open file in exisiting application")
        return 0

    signal.signal(signal.SIGINT, signit_handler)
    timer = QTimer()
    timer.start(500)
    timer.timeout.connect(lambda: None)  # Let the interpreter run each 500 ms.

    mainWindow.show()
    status = app.exec()
    sys.exit(status)


if __name__ == '__main__':
    main()
