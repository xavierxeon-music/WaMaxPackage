#!/usr/bin/env python3

import signal
import sys

from PySide6.QtCore import QTimer
from PySide6.QtWidgets import QApplication

from lib import MainWindow, Select


def _signit_handler(*args):

   QApplication.quit()


def main():

   QApplication.setOrganizationName('Schweinesystem')
   QApplication.setOrganizationDomain('schweinesystem.ddns.net')
   QApplication.setApplicationName('Sofa Analyser')

   fileName = Select.fileName()

   app = QApplication([])

   signal.signal(signal.SIGINT, _signit_handler)
   timer = QTimer()
   timer.start(500)
   timer.timeout.connect(lambda: None)  # Let the interpreter run each 500 ms.

   mainWindow = MainWindow(fileName)
   mainWindow.show()
   status = app.exec()
   sys.exit(status)


if __name__ == '__main__':
   main()
