from PySide6.QtCore import QObject

import json
import os

from _common import TimePoint

from PySide6.QtCore import Signal


class Calender(QObject):

    loaded = Signal()
    timePointSelected = Signal(str)

    the = None

    def __init__(self):

        super().__init__()
        Calender.the = self

        self.data = dict()

    def load(self, fileName):

        if not os.path.exists(fileName):
            return False

        try:
            with open(fileName, 'r') as infile:
                self.data = json.load(infile)
        except json.JSONDecodeError:
            return False

        self.loaded.emit()
        return True

    def save(self, fileName):

        with open(fileName, 'w') as outfile:
            json.dump(self.data, outfile, indent=3)

    def clear(self):

        self.data = dict()
        self.loaded.emit()

    def isValidTimePoint(self, timePoint):

        tp = TimePoint(timePoint)
        if not tp.valid():
            return False

        if timePoint in self.data:
            return False

        return True

    def setCurrent(self, timePoint):

        self.timePointSelected.emit(timePoint)
