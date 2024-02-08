import numpy as np
from scipy.optimize import curve_fit

# https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.curve_fit.html


def amplitudeFunction(x, max, start, peak, end):

   width = np.where(x < peak, 2 * (peak - start), 2 * (end - peak))
   exponent = ((x - peak) / width)**2
   y = max * np.exp(-exponent)
   return y


def estimateParams(series):

   start = None
   end = 0

   peak = 0.0
   max = 0.0
   for index in range(series.shape[0]):
      value = series[index]
      if value > max:
         max = value
         peak = index
      if value > 0:
         end = index
         if None == start:
            start = index

   estimate = [max, start, peak, end]
   return estimate


def fitAmplitude(series):

   estimate = estimateParams(series)

   samples = np.arange(series.shape[0])
   try:
      parameters, _ = curve_fit(amplitudeFunction, samples, series, estimate)
   except RuntimeError:
      parameters, _ = curve_fit(amplitudeFunction, samples, series, estimate, maxfev=50000)

   return parameters
