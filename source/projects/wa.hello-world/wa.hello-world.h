#ifndef WaHelloWorldH
#define WaHelloWorldH

#include "c74_min.h"

using namespace c74::min;

class hello_world : public object<hello_world>
{
public:
   MIN_DESCRIPTION{"Post to the Max Console."};
   MIN_TAGS{"utilities"};
   MIN_AUTHOR{"Ralf Wasoe"};
   MIN_RELATED{"print"};

public:
   hello_world();

public:
   inlet<> input;
   outlet<> output;

   argument<symbol> greeting_arg;
   attribute<symbol> greeting;

   message<> bang;
   message<> maxclass_setup;

public:
   void setGreeting(const atom& arg);
   atoms onBang(const atoms& as, const int inlet);
   atoms onMaxClassSteup(const atoms& as, const int inlet);
};

#endif // WaHelloWorldH
