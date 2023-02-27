#ifndef WaHelloWorldH
#define WaHelloWorldH

#include "c74_min.h"

using namespace c74::min;

template <typename MinClassType>
class Object : public object<MinClassType>
{
public:
   Object();

public:
   static argument_function af(void (MinClassType::*functionPointer)(const atom& arg));
};

class hello_world : public Object<hello_world>
{
public:
   MIN_DESCRIPTION{"Post to the Max Console."};
   MIN_TAGS{"utilities"};
   MIN_AUTHOR{"Cycling '74"};
   MIN_RELATED{"print, jit.print, dict.print"};

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
