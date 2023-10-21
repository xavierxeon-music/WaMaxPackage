

class TimePoint:

    def __init__(self):

        self.bar = None
        self.beat = None

    def __str__(self):

        if not self.valid():
            return '0.0'

        return f'{self.bar}.{self.beat}'

    @staticmethod
    def fromString(text):

        tp = TimePoint()

        content = text.split('.')
        if 2 != len(content):
            return tp

        try:
            tp.bar = int(content[0])
            tp.beat = int(content[1])
        except ValueError:
            return tp

        return tp

    def valid(self):

        if not self.bar or not self.beat:
            return False

        if self.bar < 1:
            return False

        if self.beat < 1:
            return False

        return True

    def __lt__(self, other):

        if not self.valid():
            return False

        if not other.valid():
            return False

        if self.bar < other.bar:
            return True
        elif self.bar == other.bar and self.beat < other.beat:
            return True

        return False

    def __eq__(self, other):

        if self.bar != other.bar:
            return False

        if self.beat != other.beat:
            return False

        return True
