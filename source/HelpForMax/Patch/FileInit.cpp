#include "FileInit.h"

#include "Package/PackageInfo.h"

void File::Init::write(Structure* structure, const QString& patchName)
{
   Init init(structure);
   init.write(patchName);
}

QString File::Init::getFilePath(const QString& patchName)
{
   const QString initPath = Package::Info::getPath() + "/init/" + patchName + ".txt";
   return initPath;
}

File::Init::Init(Structure* structure)
   : Abstract(structure)
{
}

void File::Init::write(const QString& patchName)
{
   const QString initPath = getFilePath(patchName);

   QFile file(initPath);

   if (structure->patch.patcherType == Structure::PatchType::Standard) // delete file
   {
      if (!file.exists()) // nothing to delete
         return;

      file.remove();
   }
   else
   {
      if (!file.open(QIODevice::WriteOnly))
         return;

      QTextStream stream(&file);

      if (structure->patch.patcherType == Structure::PatchType::Gui)
      {
         stream << "max objectfile " << patchName << " " << patchName << ";\n";
         stream << "max definesubstitution " << patchName << " bpatcher @name " << patchName << ".maxpat;\n";
      }
      else if (structure->patch.patcherType == Structure::PatchType::Poly)
      {
         stream << "max objectfile " << patchName << " " << patchName << ";\n";
         stream << "max definesubstitution " << patchName << " poly~ " << patchName << " 16;\n";
      }
      file.close();
   }
}
