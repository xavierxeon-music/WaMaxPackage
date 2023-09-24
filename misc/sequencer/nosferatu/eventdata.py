from PySide6.QtCore import QObject

import json

from PySide6.QtCore import Signal


class Event:

    def __init__(self):

        self.active = False
        self.value = 0


class EventData(QObject):

    updated = Signal()
    loaded = Signal()

    def __init__(self):

        super().__init__()
        self.length = 16

        self.eventList = []

    def load(self, fileName):

        with open(fileName, 'r') as infile:
            content = json.load(infile)

        self.length = content['length']
        self._createEmptyEventList()

        activeEventList = content["events"]
        self._applyActiveEventList(activeEventList)

        self.loaded.emit()
        self.updated.emit()

    def save(self, fileName):

        acticveEventList = self._compileActiveEventList()
        content = {'length': self.length, 'events': acticveEventList}
        with open(fileName, 'w') as outfile:
            json.dump(content, outfile, indent=3)

    def toggle(self, timePoint, rowNumber):

        cell = self.eventList[timePoint][rowNumber]
        if cell.active:
            cell.active = False
        else:
            cell.active = True
            if 0 == cell.value:
                cell.value = 127

        self.updated.emit()

    def setValue(self, timePoint, rowNumber, value):

        cell = self.eventList[timePoint][rowNumber]
        cell.active = True
        cell.value = value

        # self.updated.emit()

    def _createEmptyEventList(self):

        self.eventList = []
        for col in range(self.length):
            timePoint = []
            for row in range(128):
                timePoint.append(Event())
            self.eventList.append(timePoint)

    def _compileActiveEventList(self):

        acticveEventList = []

        for col in range(self.length):
            timePoint = []
            for rowNumber in range(128):
                cell = self.eventList[col][rowNumber]
                if cell.active:
                    timePoint.append([rowNumber, cell.value])

            acticveEventList.append(timePoint)

        return acticveEventList

    def _applyActiveEventList(self, activeEventList):

        for col in range(self.length):
            for entry in activeEventList[col]:
                rowNumber = entry[0]
                value = entry[1]

                cell = self.eventList[col][rowNumber]
                cell.active = True
                cell.value = value
