#include "c74_min.h"
using namespace c74::min;

#include <inttypes.h>
#include <vector>

class from7bit : public object<from7bit>
{
public:
   MIN_DESCRIPTION{"7bit list to int"};

   inlet<> input{this, "(list) values to from7bit"};
   outlet<> output{this, "(int) result of convolution"};

   atoms listFunction(const atoms &args, const int inlet)
   {
      std::vector<uint8_t> sevenBits;
      for (auto i = 0; i < args.size(); ++i)
      {
         const int value = args[i];
         sevenBits.insert(sevenBits.begin(), value);
      }

      long number = 0;
      long power = 1;

      for (const uint8_t &value : sevenBits)
      {
         number += value * power;
         power *= 128;
      }

      output.send(number);
      return {};
   }

   // clang-format off
   message<> list{this, "list", "Input to the convolution function.", MIN_FUNCTION{return listFunction(args, inlet);}};
// clang-format on
}
;

MIN_EXTERNAL(from7bit);
