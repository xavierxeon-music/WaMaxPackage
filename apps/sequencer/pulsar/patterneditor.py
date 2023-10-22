from PySide6.QtWidgets import QWidget

from PySide6.QtCore import Signal
from PySide6.QtGui import QPainter

from .calendar import Calendar
from .pattern import Pattern


class PatternEditor(QWidget):

    editing_finished = Signal()

    def __init__(self, parent=None):

        super().__init__(parent)
        self.pattern = Pattern()

        self.setMouseTracking(True)
        self.setAutoFillBackground(True)

    def sizeHint(self):

        return self.pattern.sizeHint()

    def paintEvent(self, event):

        with QPainter(self) as painter:
            self.pattern.paint(painter, self.rect(), self.palette(), isEditable=True)

    def mousePressEvent(self, event):

        index = self._index(event)
        if None == index:
            return

        self.pattern.toggleBit(index)
        self.update()

        Calendar.the.beatModified.emit()

    def mouseDoubleClickEvent(self, event):

        index = self._index(event)
        if None == index:
            self.editing_finished.emit()

    def _index(self, event):

        index = int(event.x() / Pattern.scale)
        if 4 == index % 5:
            return None

        realIndex = index
        while index > 4:
            realIndex -= 1
            index -= 5

        return realIndex
