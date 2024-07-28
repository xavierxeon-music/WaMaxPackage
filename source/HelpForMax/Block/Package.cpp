#include "Package.h"

#include <QDir>
#include <QFileInfo>
#include <QJsonDocument>
#include <QJsonObject>

Package* Package::me = nullptr;

QString Package::setPatchPath(const QString& patchPath)
{
   QFileInfo info(patchPath);
   const QString patchName = info.fileName().replace(".maxpat", "");

   QString packagePath;
   QDir dir = info.dir();

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

   if (!packagePath.isEmpty() && packagePath != me->path)
   {
      me->path = packagePath;
      me->author = "";
      me->name = "";

      const QString fileName = packagePath + "/package-info.json";

      QFile file(fileName);
      if (file.open(QIODevice::ReadOnly))
      {
         const QJsonDocument doc = QJsonDocument::fromJson(file.readAll());
         file.close();

         const QJsonObject object = doc.object();
         if (!object.empty())
         {
            me->author = object["author"].toString();
            me->name = object["name"].toString();
         }
      }
   }

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
