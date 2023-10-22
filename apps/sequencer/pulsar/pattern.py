#

from PySide6.QtGui import QPainter, QPalette
from PySide6.QtCore import QSize, Qt


class Pattern:

    scale = 15
    Role = Qt.UserRole + 10

    def __init__(self):

        super().__init__()

        self.length = 16
        self.values = [0, 0]

    def toDict(self):

        return {'length': self.length, 'values': self.values}

    @staticmethod
    def fromDict(dictIn):

        p = Pattern()

        if 'length' in dictIn:
            p.length = dictIn['length']
        if 'values' in dictIn:
            p.values = dictIn['values']

        return p

    def readBit(self, index):

        if index < 0 or index >= self.length:
            return False

        bit = index % 8
        mask = (1 << bit)

        offset = int((index - bit) / 8)
        byte = self.values[offset]

        test = (mask & byte) != 0

        return test

    def toggleBit(self, index):

        if index < 0 or index >= self.length:
            return

        bit = index % 8
        mask = (1 << bit)

        offset = int((index - bit) / 8)
        byte = self.values[offset]

        add = (mask & byte) == 0

        if add:
            self.values[offset] = (byte | mask)
        else:
            invMask = ~mask
            self.values[offset] = (byte & invMask)

    def sizeHint(self):

        return Pattern.scale * QSize(self.length, 1)

    def paint(self, painter, rect, palette, isEditable=False):

        painter.save()

        painter.setRenderHint(QPainter.Antialiasing, True)

        if isEditable:
            painter.setPen(palette.color(QPalette.Highlight))
        else:
            painter.setPen(palette.color(QPalette.WindowText))

        y_offset = (rect.height() - Pattern.scale) / 2
        painter.translate(rect.x(), rect.y() + y_offset)

        p = 0.1 * Pattern.scale
        d = 0.8 * Pattern.scale

        for index in range(self.length):
            if self.readBit(index):
                painter.setBrush(palette.windowText())
            else:
                painter.setBrush(Qt.NoBrush)

            painter.drawEllipse(p, p, d, d)
            painter.translate(Pattern.scale, 0.0)
            if 3 == index % 4:
                painter.translate(Pattern.scale, 0.0)

        painter.restore()
