from PySide6.QtWidgets import QStyledItemDelegate

from PySide6.QtWidgets import QStyle

from .pattern import Pattern
from .patterneditor import PatternEditor


class PatternDelegate(QStyledItemDelegate):

    def __init__(self):

        super().__init__()

    def sizeHint(self, option, index):

        if index.column() != 3:
            return QStyledItemDelegate.sizeHint(self, option, index)

        pattern = index.data(Pattern.Role)
        return pattern.sizeHint()

    def paint(self, painter, option, index):

        if index.column() != 3:
            QStyledItemDelegate.paint(self, painter, option, index)
            return

        pattern = index.data(Pattern.Role)

        if option.state & QStyle.State_Selected:
            # print('selected', pattern.toDict())
            painter.fillRect(option.rect, painter.brush())

        pattern.paint(painter, option.rect, option.palette)

    def createEditor(self, parent, option, index):

        if index.column() != 3:
            return QStyledItemDelegate.createEditor(self, parent, option, index)

        editor = PatternEditor(parent)
        editor.editing_finished.connect(self.commit_and_close_editor)
        return editor

    def setEditorData(self, editor, index):

        if index.column() != 3:
            QStyledItemDelegate.setEditorData(self, editor, index)
            return

        editor.pattern = index.data(Pattern.Role)

    def setModelData(self, editor, model, index):

        if index.column() != 3:
            QStyledItemDelegate.setModelData(self, editor, model, index)
            return

        model.setData(index, editor.pattern, Pattern.Role)

    def commit_and_close_editor(self):

        editor = self.sender()

        # The commitData signal must be emitted when we've finished editing
        # and need to write our changed back to the model.
        self.commitData.emit(editor)
        self.closeEditor.emit(editor, QStyledItemDelegate.NoHint)
