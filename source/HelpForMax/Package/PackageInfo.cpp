#include "PackageInfo.h"

#include <QDir>

#include <QJsonDocument>
#include <QJsonObject>

#include "MessageBar.h"

Package::Info* Package::Info::me = nullptr;

bool Package::Info::setPackage(const QString& someFileInPackage)
{
   return me->update(someFileInPackage);
}

QString Package::Info::extractPatchName(const QString& patchFileName)
{
   QFileInfo patchInfo(patchFileName);
   const QString patchName = patchInfo.fileName().replace(".maxpat", "");

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

void Package::Info::clear()
{
   path = "";
   author = "";
   name = "";

   Message::Bar::message() << "PACKAGE UNLOADED";
}

bool Package::Info::update(const QString& someFileInPackage)
{
   QFileInfo patchInfo(someFileInPackage);

   if (!path.isEmpty())
   {
      if (patchInfo.absoluteFilePath().startsWith(path))
         return true;
      else
         return false;
   }

   //clear();

   if (!patchInfo.exists())
      return false;

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
      return false;

   QFile file(fileName);
   if (!file.open(QIODevice::ReadOnly))
      return false;

   const QJsonDocument doc = QJsonDocument::fromJson(file.readAll());
   file.close();

   const QJsonObject object = doc.object();
   if (!object.empty())
   {
      author = object["author"].toString();
      name = object["name"].toString();

      Message::Bar::message() << "LOADED PACKAGE " << name;
   }

   create(path);
   return true;
}
