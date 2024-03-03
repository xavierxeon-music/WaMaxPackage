#ifndef CommonObjectHPP
#define CommonObjectHPP

#include "Object.h"

Common::Object::Object(const std::string& name)
   : name(name)
{
}

void Common::Object::init()
{
   t_class* c = class_new(name.data(), (method)To7Bit::create, (method)To7Bit::destroy, (long)sizeof(To7Bit::Data), 0L, A_GIMME, 0);
}

#endif // NOT CommonObjectHPP
