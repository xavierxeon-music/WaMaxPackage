#ifndef FileAbstractH
#define FileAbstractH

#include "Structure.h"

namespace File
{
   class Abstract
   {
   public:
      Abstract(Structure* structure);

   protected:
      Structure* structure;
   };
} // namespace File

#endif // NOT FileAbstractH
