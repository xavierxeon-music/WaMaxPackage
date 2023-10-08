from PySide6.QtCore import QObject

import json
import os

from PySide6.QtCore import Signal

from .sequence import Sequence


class TimeLine(QObject):

    updated = Signal()
    loaded = Signal()
    sequenceUpdated = Signal()

    def __init__(self):

        super().__init__()
        self.sequence = Sequence(self)
        self.asNotes = True

        self.eventList = []

    def currentSequence(self):

        return self.sequence

    def setAsNotes(self, value):

        self.asNotes = value

        self.loaded.emit()
        self.sequenceUpdated.emit()

    def load(self, fileName):

        if os.path.exists(fileName):
            with open(fileName, 'r') as infile:
                content = json.load(infile)

            self.sequence.apply(content)
        else:
            self._createEmptyEventList()

        self.loaded.emit()
        self.updated.emit()
        self.sequenceUpdated.emit()

    def save(self, fileName):

        content = self.sequence.compile()
        with open(fileName, 'w') as outfile:
            json.dump(content, outfile, indent=3)
