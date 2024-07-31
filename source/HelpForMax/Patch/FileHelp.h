#ifndef FileHelpH
#define FileHelpH

#include "FileAbstract.h"

namespace File
{
   class Help : public Abstract
   {
   public:
      Help(Structure* structure);

   public:
      void write(const QString& patchName) override;
      QString getFilePath(const QString& patchName) override;
   };
} // namespace File

#endif // NOT FileHelpH
