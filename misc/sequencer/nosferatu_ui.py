#!/usr/bin/env python3

# fmt: off
from _common import addCommonToSysPath
addCommonToSysPath()

from nosferatu import MainWidget
# fmt: on

if __name__ == '__main__':
    MainWidget.start('Nosferatu Editor')
