#include "wa.helpfile.h"

#include <string>

#include <QDir>
#include <QFileInfo>
#include <QJsonDocument>
#include <QJsonObject>

#include "../../HelpForMax/HelpForMax.h"
#include "../common.h"

HelpFile::HelpFile(const atoms& args)
   : object<HelpFile>()
   , ui_operator::ui_operator(this, args)
   , paint{this, "paint", minBind(this, &HelpFile::paintFunction)}
   , dblclick(this, "mousedoubleclick", minBind(this, &HelpFile::mouseDoubleClickFunction))
   , loopTimer(this, minBind(this, &HelpFile::timerFunction))
   , patchPath()
   , refPath()
   , socket(nullptr)
   , state(State::Initial)
{
   socket = new QLocalSocket();
   loopTimer.delay(10);
}

HelpFile::~HelpFile()
{
   delete socket;
}

atoms HelpFile::paintFunction(const atoms& args, const int inlet)
{
   target render(args);

   // background
   const color bg = color{0.0, 0.0, 0.0, 1.0};
   rect<fill>{render, bg};

   // field
   color highlight = color{0.7, 0.3, 0.3, 1.0};
   if (State::HelpFileOutdated == state)
      highlight = color{0.7, 0.7, 0.3, 1.0};
   else if (State::UpToDate == state)
      highlight = color{0.3, 0.7, 0.3, 1.0};

   rect<fill>{render, highlight, position{5.0, 5.0}, size{30.0, 30.0}};

   // the H
   rect<fill>{render, bg, position{10.0, 10.0}, size{5.0, 20.0}};
   rect<fill>{render, bg, position{25.0, 10.0}, size{5.0, 20.0}};
   rect<fill>{render, bg, position{15.0, 17.5}, size{10.0, 5.0}};

   return {};
}

atoms HelpFile::mouseDoubleClickFunction(const atoms& args, const int inlet)
{
   if (State::NotInPackage == state)
      return {};

   if (!socket->waitForConnected())
   {
      if (!HelpForMax::isServerActive())
         HelpForMax::startApplication();

      socket->connectToServer(HelpForMax::compileSockerName());
      socket->waitForConnected();
   }
   sendData();

   return {};
}

atoms HelpFile::timerFunction(const atoms& args, const int inlet)
{
   if (State::Initial == state)
   {
      patchPath = QString::fromStdString(Patcher::path(this));
      // TODO macos only
      const int slashIndex = patchPath.indexOf("/", 1);
      const QString colonTest = (-1 != slashIndex) ? patchPath.mid(slashIndex - 1, 1) : "";
      if (":" == colonTest)
      {
         const QString front = patchPath.mid(0, slashIndex - 1);
         const QString back = patchPath.mid(slashIndex);

         patchPath = "/Volumes/" + front + back;
      }

      checkState();
      redraw();
   }

   if (State::NotInPackage == state)
      return {}; // only need to check for incoming data if in package

   auto readRead = [&]()
   {
      if (socket->state() != QLocalSocket::ConnectedState)
         return false;

      if (!socket->waitForReadyRead(100))
         return false;

      if (socket->bytesAvailable() == 0)
         return false;

      return true;
   };

   if (readRead())
      receiveData();

   loopTimer.delay(1000);
   return {};
}

void HelpFile::sendData()
{
   QJsonObject object;
   object["patch"] = patchPath;

   QJsonDocument doc(object);
   socket->write(doc.toJson(QJsonDocument::Compact));
   socket->flush();
}

void HelpFile::receiveData()
{
   const QJsonDocument doc = QJsonDocument::fromJson(socket->readAll());
   const QJsonObject object = doc.object();

   const QString path = object["patch"].toString();
   if (path != patchPath)
      return;

   checkState();
   redraw();
}

void HelpFile::checkState()
{
   const QFileInfo patchInfo(patchPath);

   if (State::Initial == state)
   {
      state = State::NotInPackage;

      const QString patchName = patchInfo.fileName().replace(".maxpat", "");
      if (!patchInfo.exists())
         return;

      for (QDir dir = patchInfo.dir(); !dir.isRoot(); dir.cdUp())
      {
         const QFileInfoList content = dir.entryInfoList(QDir::Files);
         for (const QFileInfo& contentInfo : content)
         {
            if ("package-info.json" != contentInfo.fileName())
               continue;

            // package info found
            const QString packagePath = dir.absolutePath();
            refPath = packagePath + "/docs/" + patchName + ".maxref.xml";
            state = State::HelpFileOutdated;

            break;
         }

         if (State::NotInPackage != state)
            break;
      }
   }

   if (State::NotInPackage == state)
      return;

   QFileInfo refInfo(refPath);

   if (refInfo.lastModified() > patchInfo.lastModified())
      state = State::UpToDate;
   else
      state = State::HelpFileOutdated;
}

MIN_EXTERNAL(HelpFile);
