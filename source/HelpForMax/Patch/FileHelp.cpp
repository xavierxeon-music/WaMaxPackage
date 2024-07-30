#include "FileHelp.h"

#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>

#include "Package/PackageInfo.h"

void File::Help::write(Structure* structure, const QString& patchName)
{
   Help help(structure);
   help.write(patchName);
}

QString File::Help::getFilePath(const QString& patchName)
{
   const QString helpPath = Package::Info::getPath() + "/help/" + patchName + ".maxhelp";
   return helpPath;
}

File::Help::Help(Structure* structure)
   : Abstract(structure)
{
}

void File::Help::write(const QString& patchName)
{
   const QString helpPath = getFilePath(patchName);

   QFile file(getFilePath(helpPath));
   if (file.exists())
      return;

   if (!file.open(QIODevice::WriteOnly))
      return;

   static const QByteArray content = []()
   {
      QJsonObject patcher;
      patcher["classnamespace"] = "box";
      patcher["description"] = "";
      patcher["digest"] = "";
      patcher["tags"] = "";
      patcher["style"] = "";
      patcher["boxes"] = QJsonArray();
      patcher["lines"] = QJsonArray();
      patcher["assistshowspatchername"] = 0;
      patcher["dependency_cache"] = QJsonArray();
      patcher["autosave"] = 0;

      QJsonObject helpData;
      helpData["patcher"] = patcher;

      QJsonDocument doc(helpData);
      const QByteArray data = doc.toJson();

      return data;
   }();

   file.write(content);
   file.close();
}
