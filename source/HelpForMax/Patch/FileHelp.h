#ifndef FileHelpH
#define FileHelpH

#include "FileAbstract.h"

namespace File
{
   class Help : public Abstract
   {
   public:
      static void write(Structure* structure, const QString& patchName);
      static QString getFilePath(const QString& patchName);

   private:
      Help(Structure* structure);

   private:
      void write(const QString& patchName);
   };
} // namespace File

#endif // NOT FileHelpH
