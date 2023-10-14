from PySide6.QtCore import QObject

import json
import os

from PySide6.QtCore import Signal

from .sequence import Sequence


class TimeLine(QObject):

    loaded = Signal()
    sequenceUpdated = Signal()
    sequenceLengthChanged = Signal()
    currentSequenceChanged = Signal()

    the = None

    def __init__(self):

        super().__init__()
        TimeLine.the = self

        self.sequences = dict()  # timestamp vs sequence
        self.asNotes = True

        self._currentKey = None

    def setCurrent(self, key):

        if key == self._currentKey:
            return

        self._currentKey = key
        self.currentSequenceChanged.emit()

    def currentSequence(self):

        if not self._currentKey:
            return None

        sequence = self.sequences[self._currentKey]
        return sequence

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
        self._currentKey = timePoint

        self.sequenceUpdated.emit()

    def remove(self, timePoint):

        print('remove time point', timePoint)
