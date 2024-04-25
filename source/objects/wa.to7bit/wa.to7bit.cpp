#include "wa.to7bit.h"

to7bit::to7bit()
   : input{this, "(int) values to to7bit"}
   , output{this, "(int) 7 bit list"}
   , intMessage{this, "int", "integer value.", std::bind(&to7bit::intFunction, this, std::placeholders::_1, std::placeholders::_2)}
{
}

atoms to7bit::intFunction(const atoms& args, const int inlet)
{
   const long intValue = args[0];
   static const char maxSize = sizeof(long);

   std::vector<uint8_t> sevenBits;
   int maxValue = 1;
   for (char i = 0; i < maxSize; i++)
   {
      if (intValue < maxValue)
         continue;

      long value = intValue >> (7 * i);
      value = value & 127;
      maxValue *= 128;
      sevenBits.insert(sevenBits.begin(), value);
   }

   atoms result(sevenBits.size());
   for (char i = 0; i < sevenBits.size(); i++)
   {
      result[i] = sevenBits[i];
   }

   output.send(result);
   return {};
}

MIN_EXTERNAL(to7bit);
