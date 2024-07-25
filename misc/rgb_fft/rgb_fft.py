#!/usr/bin/env python3

from lib import Data, Plot, Wave


def main():

   data = Data()
   plot = Plot(data)
   plot.create('test.png')

   wave = Wave(data)
   wave.write('rgb_fft.wav')


if __name__ == '__main__':
   main()
