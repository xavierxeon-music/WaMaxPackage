from PySide6.QtCore import QObject, Signal

import json
import os

from .tagmodel import TagModel


class Calendar(QObject):

    loaded = Signal()
    updated = Signal()
    tagsUpdated = Signal()

    the = None

    def __init__(self):

        super().__init__()
        Calendar.the = self

        self.tags = dict()
        self.tagModel = TagModel(self)

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
