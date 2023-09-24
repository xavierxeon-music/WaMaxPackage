from PySide6.QtGui import QStandardItemModel


class EventModel(QStandardItemModel):

    def __init__(self, eventData):

        super().__init__()
        self._eventData = eventData
        eventData.updated.connect(self.update)

    def update(self):

        print('update')
