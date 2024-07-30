#ifndef FileInitH
#define FileInitH

#include "FileAbstract.h"

namespace File
{
   class Init : public Abstract
   {
   public:
      static void write(Structure* structure, const QString& patchName);
      static QString getFilePath(const QString& patchName);

   public:
      Init(Structure* structure);

   private:
      void write(const QString& patchName);
   };
} // namespace File

#endif // NOT FileInitH
