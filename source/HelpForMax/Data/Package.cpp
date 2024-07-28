#include "Package.h"

#include <QDir>

#include <QJsonDocument>
#include <QJsonObject>

Package* Package::me = nullptr;

QString Package::setPatchPath(const QString& patchPath)
{
   QFileInfo patchInfo(patchPath);
   const QString patchName = patchInfo.fileName().replace(".maxpat", "");

   me->update(patchInfo);

   return patchName;
}

QString Package::getPath()
{
   if (!me)
      return QString();

   return me->path;
}

QString Package::getName()
{
   if (!me)
      return QString();

   return me->name;
}

QString Package::getAuthor()
{
   if (!me)
      return QString();

   return me->author;
}

Package::Package()
   : path()
   , name()
   , author()
{
   me = this;
}

Package::~Package()
{
   me = nullptr;
}

void Package::update(const QFileInfo& patchInfo)
{
   if (patchInfo.absoluteFilePath().startsWith(path))
      return;
   else
      ; // package has changed, display message

   QString packagePath;
   QDir dir = patchInfo.dir();

   while (packagePath.isEmpty())
   {
      const QFileInfoList content = dir.entryInfoList(QDir::Files);
      for (const QFileInfo& contentInfo : content)
      {
         if ("package-info.json" != contentInfo.fileName())
            continue;

         packagePath = contentInfo.dir().absolutePath();
         break;
      }
      dir.cdUp();
      if (dir.isRoot())
         break;
   }

   if (packagePath.isEmpty())
      return;

   if (packagePath != path)
   {
      path = packagePath;
      author = "";
      name = "";

      const QString fileName = packagePath + "/package-info.json";

      QFile file(fileName);
      if (file.open(QIODevice::ReadOnly))
      {
         const QJsonDocument doc = QJsonDocument::fromJson(file.readAll());
         file.close();

         const QJsonObject object = doc.object();
         if (!object.empty())
         {
            author = object["author"].toString();
            name = object["name"].toString();
         }
      }
   }
}
