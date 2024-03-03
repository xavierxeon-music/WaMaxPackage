#ifndef CommonObjectH
#define CommonObjectH

extern "C"
{
#include "ext.h"      // standard Max include, always required
#include "ext_obex.h" // required for new style Max object
}

#include <string>

namespace Common
{
   class Object
   {
   public:
      inline Object(const std::string& name);

   public:
      void init();

   private:
      std::string name;
   };
} // namespace Common

#ifndef CommonObjectHPP
#include "Object.hpp"
#endif // NOT CommonObjectHPP

#endif // NOT CommonObjectH
