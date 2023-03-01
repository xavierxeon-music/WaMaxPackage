#include "wa.hello-world.h"

#include "../wacommon.h"

hello_world::hello_world()
   : object<hello_world>()
   , input(this, "(bang) post greeting to the max console")
   , output(this, "(anything) output the message which is posted to the max console")
   , greeting_arg(this, "greeting", "Initial value for the greeting attribute.", memFunc(this, &hello_world::setGreeting))
   , greeting(this, "greeting", "more songs about food and architecture", description("set the greeting message."))
   , bang(this, "bang", "Post the greeting.", memFunc(this, &hello_world::onBang))
   , maxclass_setup(this, "maxclass_setup", memFunc(this, &hello_world::onMaxClassSteup))
{
}

void hello_world::setGreeting(const atom& arg)
{
   greeting = arg;
}

atoms hello_world::onBang(const atoms& as, const int inlet)
{
   symbol the_greeting =
      greeting; // fetch the symbol itself from the attribute named greeting

   cout << the_greeting << endl; // post to the max console
   output.send(the_greeting);    // send out our outlet

   return {};
}

atoms hello_world::onMaxClassSteup(const atoms& as, const int inlet)
{
   cout << "hello world++" << endl;
   return {};
}

MIN_EXTERNAL(hello_world);
