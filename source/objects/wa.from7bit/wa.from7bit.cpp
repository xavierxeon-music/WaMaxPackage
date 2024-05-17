#include "wa.from7bit.h"

#include <inttypes.h>
#include <vector>

#include "../common.h"

from7bit::from7bit()
   : object<from7bit>()
   , input{this, "(list) 7 bit list"}
   , output{this, "(int) integer value"}
   , listMessage{this, "list", "7 bit list.", minBind(this, &from7bit::listFunction)}
{
}

atoms from7bit::listFunction(const atoms& args, const int inlet)
{
   std::vector<uint8_t> sevenBits;
   for (auto i = 0; i < args.size(); ++i)
   {
      const int value = args[i];
      sevenBits.insert(sevenBits.begin(), value);
   }

   long number = 0;
   long power = 1;

   for (const uint8_t& value : sevenBits)
   {
      number += value * power;
      power *= 128;
   }

   output.send(number);
   return {};
}

MIN_EXTERNAL(from7bit);
