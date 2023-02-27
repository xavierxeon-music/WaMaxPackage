#include "wa.hello-world.h"

template <typename MinClassType>
Object<MinClassType>::Object()
   : object<MinClassType>()
{
}

template <typename MinClassType>
argument_function Object<MinClassType>::af(void (MinClassType::*functionPointer)(const atom& arg))
{
}

hello_world::hello_world()
   : Object<hello_world>()
   , input(this, "(bang) post greeting to the max console")
   , output(this, "(anything) output the message which is posted to the max console")
   , greeting_arg(this, "greeting", "Initial value for the greeting attribute.", std::bind(&hello_world::setGreeting, this, std::placeholders::_1))
   , greeting(this, "greeting", "hello world", description{"Greeting to be posted.\n The greeting will be posted to the Max console when a bang is received."})
   , bang(this, "bang", "Post the greeting.", std::bind(&hello_world::onBang, this, std::placeholders::_1, std::placeholders::_2))
   , maxclass_setup(this, "maxclass_setup", std::bind(&hello_world::onMaxClassSteup, this, std::placeholders::_1, std::placeholders::_2))
{
}

void hello_world::setGreeting(const atom& arg)
{
   greeting = arg;
}

atoms hello_world::onBang(const atoms& as, const int inlet)
{
   symbol the_greeting = greeting; // fetch the symbol itself from the attribute named greeting

   cout << the_greeting << endl; // post to the max console
   output.send(the_greeting);    // send out our outlet

   return {};
}

atoms hello_world::onMaxClassSteup(const atoms& as, const int inlet)
{
   cout << "hello world" << endl;
   return {};
}

MIN_EXTERNAL(hello_world);

/*
class hello_world : public object<hello_world>
{
public:
   MIN_DESCRIPTION{"Post to the Max Console."};
   MIN_TAGS{"utilities"};
   MIN_AUTHOR{"Cycling '74"};
   MIN_RELATED{"print, jit.print, dict.print"};

   inlet<> input{this, "(bang) post greeting to the max console"};
   outlet<> output{this, "(anything) output the message which is posted to the max console"};

   // define an optional argument for setting the message
   argument<symbol> greeting_arg{this, "greeting", "Initial value for the greeting attribute.",
                                 MIN_ARGUMENT_FUNCTION{
                                    greeting = arg;
}
}
;

// the actual attribute for the message
attribute<symbol> greeting{this, "greeting", "hello world",
                           description{
                              "Greeting to be posted. "
                              "The greeting will be posted to the Max console when a bang is received."}};

// respond to the bang message to do something
message<> bang{this, "bang", "Post the greeting.",
               MIN_FUNCTION{
                  symbol the_greeting = greeting; // fetch the symbol itself from the attribute named greeting

cout << the_greeting << endl; // post to the max console
output.send(the_greeting);    // send out our outlet
return {};
}
}
;

// post to max window == but only when the class is loaded the first time
message<> maxclass_setup{this, "maxclass_setup",
                         MIN_FUNCTION{
                            cout << "hello world" << endl;
return {};
}
}
;
}
;

*/
