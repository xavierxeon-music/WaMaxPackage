import numpy as np
from scipy.optimize import curve_fit

# https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.fit.html
# https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.norm.html
# https://en.wikipedia.org/wiki/Normal_distribution


def gauss(x, width, mean, max):
   exponent = ((x - mean) / width)**2
   y = max * np.exp(-exponent)
   return y


def normalFit(series):

   samples = np.arange(series.shape[0])
   print(samples)
   print(series)

   parameters, _ = curve_fit(gauss, samples, series)

   print(parameters)
