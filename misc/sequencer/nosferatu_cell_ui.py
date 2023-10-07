#!/usr/bin/env python3

# fmt: off
from _common import addCommonToSysPath, SingeltonWindow
addCommonToSysPath()

from nosferatu import MainWidgetCell
# fmt: on

if __name__ == '__main__':
    # main()
    SingeltonWindow.start('Nosferatu Cell Editor', MainWidgetCell)
