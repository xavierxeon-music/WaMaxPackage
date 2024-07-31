#ifndef FileInitH
#define FileInitH

#include "FileAbstract.h"

namespace File
{
   class Init : public Abstract
   {
   public:
      Init(Patch::Structure* structure);

   public:
      void write(const QString& patchName) override;
      QString getFilePath(const QString& patchName) override;
   };
} // namespace File

#endif // NOT FileInitH
