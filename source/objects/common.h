#ifndef WaPackageCommonH
#define WaPackageCommonH

#include <functional>

#include "c74_min.h"
using namespace c74::min;

template <typename ClassType>
function minBind(ClassType* instance, atoms (ClassType::*functionPointer)(const atoms&, const int))
{
   return std::bind(functionPointer, instance, std::placeholders::_1, std::placeholders::_2);
}

#ifndef WaPackageCommonHPP
#include "common.hpp"
#endif // NOT WaPackageCommonHPP

#endif // NOT WaPackageCommonH
