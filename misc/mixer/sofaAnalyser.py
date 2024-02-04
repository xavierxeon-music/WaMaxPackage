#!/usr/bin/env python3

from lib import Plot, PlotCrawler, Select


def main():

   fileName = Select.fileName()
   data = PlotCrawler(fileName).data

   plot = Plot(data)
   plot.startValue()


if __name__ == '__main__':
   main()
