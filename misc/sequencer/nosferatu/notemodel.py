from PySide6.QtGui import QStandardItemModel


class NoteModel(QStandardItemModel):

    def __init__(self):

        super().__init__()

    def load(self, fileName):

        print('NOTE MODEL LOAD', fileName)
