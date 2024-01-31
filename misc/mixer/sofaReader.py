#!/usr/bin/env python3

from lib import Select, WaveFile


def main():

   fileName = Select.fileName()
   wf = WaveFile(fileName)
   wf.write()


if __name__ == '__main__':
   main()
