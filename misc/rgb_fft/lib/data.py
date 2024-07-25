#

import sys

try:
   from colormath.color_objects import sRGBColor, XYZColor
   from colormath.color_conversions import convert_color
except ModuleNotFoundError:
   print('pip3 install --user colormath')
   sys.exit(1)


class Data:

   class Entry:

      def __init__(self, content):

         self.waveLength = int(content[0])
         self.x = float(content[1])
         self.y = float(content[2])
         self.z = float(content[3])

         xyz = XYZColor(self.x, self.y, self.z)
         rgb = convert_color(xyz, sRGBColor)
         rgb = [color for color in rgb.get_value_tuple()]
         self.red = rgb[0]
         self.green = rgb[1]
         self.blue = rgb[2]

      def __str__(self):

         return f'@ {self.waveLength}: xyz = [{self.x}, {self.y}, {self.z}] rgb = [{self.red}, {self.green}, {self.blue}]'

   def __init__(self):

      self.entries = list()

      with open('ciexyz31_1.txt', 'r') as infile:
         for line in infile.readlines():
            line = line.strip()
            content = line.split(',')
            content = [x.strip() for x in content]

            entry = Data.Entry(content)
            self.entries.append(entry)

      self.minLength = self.entries[0].waveLength
      self.maxLength = self.entries[-1].waveLength
      self.span = self.maxLength - self.minLength

      self.maxRGB = 0
      for entry in self.entries:
         value = entry.red + entry.green + entry.blue
         if value > self.maxRGB:
            self.maxRGB = value

      self._normalize()

   def _normalize(self):

      for entry in self.entries:
         entry.red = entry.red / self.maxRGB
         entry.green = entry.green / self.maxRGB
         entry.blue = entry.blue / self.maxRGB

   def __len__(self):

      return len(self.entries)

   def __getitem__(self, index):

      return self.entries[index]
