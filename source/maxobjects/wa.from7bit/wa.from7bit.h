
#ifndef WaFrom7BitH
#define WaFrom7BitH

#include "c74_min.h"
using namespace c74::min;

class From7Bit : public object<From7Bit>
{
public:
   MIN_DESCRIPTION{"7bit list to int"};

public:
   From7Bit();

public:
   inlet<> input;
   outlet<> output;
   message<> listMessage;

private:
   atoms listFunction(const atoms& args, const int inlet);
};

#endif // NOT  WaFrom7BitH
