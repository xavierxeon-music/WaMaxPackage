#!/usr/bin/env python3

import signal
import sys

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QApplication

from nosferatu import MainWidget


def signit_handler(*args):

    QApplication.quit()


def main():

    app = QApplication([])

    app.setOrganizationName('SDU Robotics')
    app.setOrganizationDomain('mmmi.sdu.dk')
    app.setApplicationName('SiteStruct BOP Tool')

    signal.signal(signal.SIGINT, signit_handler)
    timer = QTimer()
    timer.start(500)
    timer.timeout.connect(lambda: None)  # Let the interpreter run each 500 ms.

    mw = MainWidget()
    mw.show()

    status = app.exec()
    sys.exit(status)


if __name__ == '__main__':
    main()
