#ifndef FileAbstractH
#define FileAbstractH

#include "PatchStructure.h"

namespace File
{
   class Abstract
   {
   public:
      Abstract(Patch::Structure* structure);

   public:
      virtual void read(const QString& patchName);
      virtual void write(const QString& patchName) = 0;
      virtual QString getFilePath(const QString& patchName) = 0;

   protected:
      Patch::Structure* structure;
   };
} // namespace File

#endif // NOT FileAbstractH
