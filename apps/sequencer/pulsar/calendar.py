from PySide6.QtCore import QObject

import json
import os

from PySide6.QtCore import Signal
from PySide6.QtGui import QStandardItem

from _common import TimePoint

from .pattern import Pattern


class Calendar(QObject):

    loaded = Signal()
    beatModified = Signal()
    beatCountChange = Signal()
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
            content = json.load(infile)

        self.tags = dict()
        for tag, tagData in content.items():
            self.tags[tag] = dict()
            for tp, patternDict in tagData.items():
                self.tags[tag][tp] = Pattern.fromDict(patternDict)

        self.loaded.emit()
        self.tagsUpdated.emit()
        self.beatCountChange.emit()

        return True

    def save(self, fileName):

        content = dict()
        for tag, tagData in self.tags.items():
            content[tag] = dict()
            for tp, pattern in tagData.items():
                content[tag][tp] = pattern.toDict()

        with open(fileName, 'w') as outfile:
            json.dump(content, outfile, indent=3)

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
        pulses[timePoint] = Pattern().toDict()
        self.beatCountChange.emit()

    def remove(self, tag, timePoint):

        pulses = self.tags[tag]
        del pulses[timePoint]

        self.beatCountChange.emit()
