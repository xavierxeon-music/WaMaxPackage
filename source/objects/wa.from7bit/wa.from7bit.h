
#ifndef WaFrom7BitH
#define WaFrom7BitH

#include "c74_min.h"
using namespace c74::min;

class from7bit : public object<from7bit>
{
public:
   MIN_DESCRIPTION{"7bit list to int"};

public:
   from7bit();

public:
   inlet<> input;
   outlet<> output;
   message<> listMessage;

private:
   atoms listFunction(const atoms& args, const int inlet);
};

#endif // NOT  WaFrom7BitH
