from PySide6.QtWidgets import QMainWindow

import sys

from PySide6.QtCore import QSettings
from PySide6.QtWidgets import QTextEdit


class MainWidget(QMainWindow):

    def __init__(self, fileName):

        super().__init__()

        self.rawView = QTextEdit('Hello')
        self.setCentralWidget(self.rawView)

        self.load(fileName)

        qtsettings = QSettings()
        self.restoreGeometry(qtsettings.value('geometry'))
        self.restoreState(qtsettings.value('state'))

    def closeEvent(self, event):

        qtsettings = QSettings()
        qtsettings.setValue('geometry', self.saveGeometry())
        qtsettings.setValue('state', self.saveState())

        super().closeEvent(event)

    def load(self, fileName):

        self.setWindowTitle(f'Nosferatu [{fileName}]')

        with open(fileName, 'r') as infile:
            text = infile.read()

        self.rawView.setPlainText(text)
