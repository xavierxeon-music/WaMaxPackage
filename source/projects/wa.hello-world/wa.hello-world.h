#ifndef WaHelloWorldH
#define WaHelloWorldH

#include "../WaCommon/WaObject.h"

class hello_world : public Wa::Object<hello_world>
{
public:
   MIN_DESCRIPTION{"Post to the Max Console."};
   MIN_TAGS{"utilities"};
   MIN_AUTHOR{"Cycling '74"};
   MIN_RELATED{"print, jit.print, dict.print"};

public:
   hello_world();

public:
   Wa::Inlet input;
   Wa::Outlet output;

   Wa::SymbolArgument greeting_arg;
   Wa::SymbolAttribute greeting;

   Wa::Message bang;
   Wa::Message maxclass_setup;

public:
   void setGreeting(const Wa::Atom& arg);
   Wa::Atoms onBang(const Wa::Atoms& as, const int inlet);
   Wa::Atoms onMaxClassSteup(const Wa::Atoms& as, const int inlet);
};

#endif // WaHelloWorldH
