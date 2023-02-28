#ifndef WaObjectHPP
#define WaObjectHPP

#include "WaObject.h"

template <typename MinClassType>
Wa::Object<MinClassType>::Object()
   : c74::min::object<MinClassType>()
{
}

template <typename MinClassType>
c74::min::argument_function Wa::Object<MinClassType>::af(void (MinClassType::*functionPointer)(const c74::min::atom&))
{
   c74::min::argument_function argFunction = std::bind(functionPointer, reinterpret_cast<MinClassType*>(this), std::placeholders::_1);
   return argFunction;
}

#endif // NOT WaObjectHPP
