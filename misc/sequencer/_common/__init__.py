#!/usr/bin/env python3

from .singleton_window import SingeltonWindow


def addCommonToSysPath():

    import os
    import sys
    common_dir_name = os.path.dirname(os.path.realpath(__file__))
    sys.path.append(common_dir_name)
