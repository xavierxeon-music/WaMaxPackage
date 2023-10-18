from PySide6.QtGui import QStandardItemModel


class PusleModel(QStandardItemModel):

    def __init__(self):

        super().__init__()

        self.setHorizontalHeaderLabels(['bar.beat', 'tag', 'length', 'pattern'])
