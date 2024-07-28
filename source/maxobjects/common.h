#ifndef WaPackageCommonH
#define WaPackageCommonH

#include <functional>

#include "c74_min.h"
using namespace c74::min;

template <typename ObjectType>
function minBind(ObjectType* object, atoms (ObjectType::*functionPointer)(const atoms&, const int))
{
   return std::bind(functionPointer, object, std::placeholders::_1, std::placeholders::_2);
}

namespace Patcher
{
   template <typename ObjectType>
   std::string path(ObjectType* object)
   {
      using namespace c74;
      max::t_object* max_patch_instance = static_cast<max::t_object*>(object->patcher());
      const char* patchPath = max::jpatcher_get_filepath(max_patch_instance)->s_name;

      return patchPath;
   }

   template <typename ObjectType>
   void setDirty(ObjectType* object, bool dirty = true)
   {
      using namespace c74;
      max::t_object* max_patch_instance = static_cast<max::t_object*>(object->patcher());
      max::jpatcher_set_dirty(max_patch_instance, dirty ? 1 : 0);
   }

} // namespace Patcher

#ifndef WaPackageCommonHPP
#include "common.hpp"
#endif // NOT WaPackageCommonHPP

#endif // NOT WaPackageCommonH
