#include "c74_min.h"
using namespace c74::min;

#include <inttypes.h>
#include <vector>

class to7bit : public object<to7bit>
{
public:
   MIN_DESCRIPTION{"int to 7bit list"};

   inlet<> input{this, "(int) values to to7bit"};
   outlet<> output{this, "(int) 7 bit list"};

   atoms intFunction(const atoms& args, const int inlet)
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

   // clang-format off
   message<> m_ints{this, "int", "integer value.", MIN_FUNCTION{return intFunction(args, inlet);}};
// clang-format on
}
;

MIN_EXTERNAL(to7bit);
