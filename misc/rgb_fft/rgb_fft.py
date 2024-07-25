#!/usr/bin/env python3

from lib import Data, Plot, Wave


def main():

   data = Data()
   plot = Plot(data)

   print(data.minLength, data.maxLength, data.span)
   print(data[0])
   print(data[-1])


if __name__ == '__main__':
   main()
