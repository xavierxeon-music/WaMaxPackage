#include "wa.hello-world.h"

hello_world::hello_world()
   : Wa::Object<hello_world>()
   , input(this, "(bang) post greeting to the max console")
   , output(this, "(anything) output the message which is posted to the max console")
   , greeting_arg(this, "greeting", "Initial value for the greeting attribute.", std::bind(&hello_world::setGreeting, this, std::placeholders::_1))
   , greeting(this, "greeting", "hello world", Wa::Description{"Greeting to be posted.\n The greeting will be posted to the Max console when a bang is received."})
   , bang(this, "bang", "Post the greeting.", std::bind(&hello_world::onBang, this, std::placeholders::_1, std::placeholders::_2))
   , maxclass_setup(this, "maxclass_setup", std::bind(&hello_world::onMaxClassSteup, this, std::placeholders::_1, std::placeholders::_2))
{
}

void hello_world::setGreeting(const Wa::Atom& arg)
{
   greeting = arg;
}

Wa::Atoms hello_world::onBang(const Wa::Atoms& as, const int inlet)
{
   Wa::Symbol the_greeting = greeting; // fetch the symbol itself from the attribute named greeting

   std::cout << the_greeting << std::endl; // post to the max console
   output.send(the_greeting);              // send out our outlet

   return {};
}

Wa::Atoms hello_world::onMaxClassSteup(const Wa::Atoms& as, const int inlet)
{
   std::cout << "hello world" << std::endl;
   return {};
}

MIN_EXTERNAL(hello_world);
