from PySide6.QtWidgets import QMainWindow

from PySide6.QtCore import QSettings


class MainWidget(QMainWindow):

    def __init__(self):

        super().__init__()

        self.setWindowTitle('Nosferatu')

        qtsettings = QSettings()
        self.restoreGeometry(qtsettings.value('geometry'))
        self.restoreState(qtsettings.value('state'))

    def closeEvent(self, event):

        qtsettings = QSettings()
        qtsettings.setValue('geometry', self.saveGeometry())
        qtsettings.setValue('state', self.saveState())

        super().closeEvent(event)
