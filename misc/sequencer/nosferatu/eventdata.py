from PySide6.QtCore import QObject

from PySide6.QtCore import Signal


class Event:

    def __init__(self):

        self.value1 = 0
        self.value2 = 0


class EventData(QObject):

    updated = Signal()

    def __init__(self):

        super().__init__()

    def load(self, fileName):

        pass

    def save(self, fileName):

        pass
