#!/usr/bin/env python3

from lib import Plot, PlotData, Select


def main():

   fileName = Select.fileName()
   data = PlotData(fileName)

   plot = Plot(data)
   plot.startValue()


if __name__ == '__main__':
   main()
