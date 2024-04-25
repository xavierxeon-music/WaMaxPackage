#ifndef WaPackageCommonH
#define WaPackageCommonH

#include <functional>

using TheFunction = std::function<int(int, int)>;

template <typename ClassType>
TheFunction bind(ClassType* instance, int (ClassType::*functionPointer)(int, int))
{
   return std::bind(functionPointer, instance, std::placeholders::_1, std::placeholders::_2);
}

#ifndef WaPackageCommonHPP
#include "common.hpp"
#endif // NOT WaPackageCommonHPP

#endif // NOT WaPackageCommonH
