from PySide6.QtCore import QObject

import json
import os

from PySide6.QtCore import Signal

from .sequence import Sequence


class TimeLine(QObject):

    updated = Signal()
    loaded = Signal()
    sequenceUpdated = Signal()

    the = None

    def __init__(self):

        super().__init__()
        TimeLine.the = self

        self.sequences = dict()  # timestamp vs sequence
        self.asNotes = True

        self.currentKey = '1.1'

    def setCurrent(self, key):

        self.currentKey = key
        self.sequenceUpdated.emit()

    def currentSequence(self):

        return self.sequences[self.currentKey]

    def setAsNotes(self, value):

        self.asNotes = value

        self.loaded.emit()
        self.sequenceUpdated.emit()

    def load(self, fileName):

        loaded = True
        if os.path.exists(fileName):
            with open(fileName, 'r') as infile:
                content = json.load(infile)
            for key, values in content.items():
                sequence = Sequence(self)
                sequence.apply(values)
                self.sequences[key] = sequence
        else:
            loaded = False
            self.sequences['1.1'] = Sequence(self)

        self.loaded.emit()
        self.updated.emit()
        self.sequenceUpdated.emit()

        return loaded

    def save(self, fileName):

        content = dict()
        for key, seqeunce in self.sequences.items():
            content[key] = seqeunce.compile()

        with open(fileName, 'w') as outfile:
            json.dump(content, outfile, indent=3)

    def add(self, timePoint):

        self.sequences[timePoint] = Sequence(self)
        self.currentKey = timePoint

        self.sequenceUpdated.emit()

    def remove(self, timePoint):

        print('remove time point', timePoint)
