from typing import Optional
from PySide6.QtCore import QObject, Signal


class Calendar(QObject):

    loaded = Signal()
    updated = Signal()

    the = None

    def __init__(self):

        super().__init__()
        Calendar.the = self

    def load(self, fileName):

        print(fileName)

    def save(self, fileName):

        print(fileName)
