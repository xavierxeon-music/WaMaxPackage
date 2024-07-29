#include "PackageInfo.h"

#include <QDir>

#include <QJsonDocument>
#include <QJsonObject>

Package::Info* Package::Info::me = nullptr;

QString Package::Info::setPatchPath(const QString& patchPath)
{
   QFileInfo patchInfo(patchPath);
   const QString patchName = patchInfo.fileName().replace(".maxpat", "");

   me->update(patchInfo);

   return patchName;
}

QString Package::Info::getPath()
{
   if (!me)
      return QString();

   return me->path;
}

QString Package::Info::getName()
{
   if (!me)
      return QString();

   return me->name;
}

QString Package::Info::getAuthor()
{
   if (!me)
      return QString();

   return me->author;
}

Package::Info::Info()
   : path()
   , name()
   , author()
{
   me = this;
}

Package::Info::~Info()
{
   me = nullptr;
}

void Package::Info::update(const QFileInfo& patchInfo)
{
   if (!path.isEmpty())
   {
      if (patchInfo.absoluteFilePath().startsWith(path))
         return;
      else
         ; // package has changed, display message
   }

   author = "";
   name = "";

   if (!patchInfo.exists())
      return;

   QString fileName;
   for (QDir dir = patchInfo.dir(); !dir.isRoot() && fileName.isEmpty(); dir.cdUp())
   {
      const QFileInfoList content = dir.entryInfoList(QDir::Files);
      for (const QFileInfo& contentInfo : content)
      {
         if ("package-info.json" != contentInfo.fileName())
            continue;

         path = contentInfo.dir().absolutePath();
         fileName = contentInfo.absoluteFilePath();
         break;
      }
   }

   if (fileName.isEmpty())
      return;

   QFile file(fileName);
   if (!file.open(QIODevice::ReadOnly))
      return;

   const QJsonDocument doc = QJsonDocument::fromJson(file.readAll());
   file.close();

   const QJsonObject object = doc.object();
   if (!object.empty())
   {
      author = object["author"].toString();
      name = object["name"].toString();
   }
}
