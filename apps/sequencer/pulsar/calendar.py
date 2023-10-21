from PySide6.QtCore import QObject

import json
import os

from PySide6.QtCore import Signal
from PySide6.QtGui import QStandardItem


from _common import TimePoint


class Calendar(QObject):

    loaded = Signal()
    updated = Signal()
    tagsUpdated = Signal()

    the = None

    def __init__(self):

        super().__init__()
        Calendar.the = self

        self.tags = dict()

    def load(self, fileName):

        if not os.path.exists(fileName):
            return False

        with open(fileName, 'r') as infile:
            self.tags = json.load(infile)

        self.loaded.emit()
        self.tagsUpdated.emit()

        return True

    def save(self, fileName):

        with open(fileName, 'w') as outfile:
            json.dump(self.tags, outfile, indent=3)

    def clear(self):

        pass

    def available(self, tag, timePoint):

        tp = TimePoint(timePoint)
        if not tp.valid():
            return False

        if not tag in self.tags.keys():
            return False

        pulses = self.tags[tag]
        if not pulses:
            return True

        if timePoint in pulses:
            return False

        return True

    def add(self, tag, timePoint):

        if not self.tags[tag]:
            self.tags[tag] = dict()

        pulses = self.tags[tag]
        pulses[timePoint] = {'length': 0, 'values': list()}

    def remove(self, tag, timePoint):

        print('remove', tag, timePoint)
