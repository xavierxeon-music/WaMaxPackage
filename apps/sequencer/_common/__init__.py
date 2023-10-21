#!/usr/bin/env python3

from .singleton_window import SingeltonWindow, icon
from .delegate_combobox import DelegateCompbBox
from .timepoint import TimePoint


def __addCommonToSysPath():

    import os
    import sys
    common_dir_name = os.path.dirname(os.path.realpath(__file__))
    sys.path.append(common_dir_name)


if __name__ == '_common':
    __addCommonToSysPath()
