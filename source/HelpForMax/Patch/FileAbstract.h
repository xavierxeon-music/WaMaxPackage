#ifndef FileAbstractH
#define FileAbstractH

#include "Structure.h"

namespace File
{
   class Abstract
   {
   public:
      Abstract(Structure* structure);

   public:
      virtual void read(const QString& patchName);
      virtual void write(const QString& patchName) = 0;
      virtual QString getFilePath(const QString& patchName) = 0;

   protected:
      Structure* structure;
   };
} // namespace File

#endif // NOT FileAbstractH
