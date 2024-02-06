import numpy as np
from scipy.optimize import curve_fit

# https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.fit.html
# https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html
# https://en.wikipedia.org/wiki/Normal_distribution


def gauss(x, mean, max, width):
   exponent = ((x - mean) / width)**2
   y = max * np.exp(-exponent)
   return y


def normalFit(series):

   start = None
   end = 0

   mean = 0.0
   max = 0.0
   for index in range(series.shape[0]):
      value = series[index]
      if value > max:
         max = value
         mean = index
      if value > 0:
         end = index
         if None == start:
            start = index

   width = 1.0 if None == start else end - start

   samples = np.arange(series.shape[0])
   parameters, _ = curve_fit(gauss, samples, series, [mean, max, width])

   return parameters
