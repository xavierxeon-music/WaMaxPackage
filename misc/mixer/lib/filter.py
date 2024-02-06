#

import math

import numpy as np


def lowpass(series):

   factor = 0.2
   cutoff = 0.01

   maxIn = 0.0
   maxOut = 0.0

   length = series.shape[0]
   out = np.zeros(series.shape)
   for index in range(length):
      # rectiy input
      inValue = math.fabs(series[index])
      if inValue < cutoff:
         inValue = 0.0
      if inValue > maxIn:
         maxIn = inValue

      # filter
      if 0 == index:
         out[0] = factor * inValue
      else:
         lastOut = out[index - 1]
         outValue = lastOut + factor * (inValue - lastOut)
         if outValue > maxOut:
            maxOut = outValue
         out[index] = outValue

   if maxIn > 1.0:
      maxIn = 1.0

   # boost and smooth
   boost = maxIn / maxOut
   for index in range(length):
      outValue = out[index] * boost
      if outValue < cutoff:
         out[index] = 0.0
      else:
         out[index] = outValue

   return out
