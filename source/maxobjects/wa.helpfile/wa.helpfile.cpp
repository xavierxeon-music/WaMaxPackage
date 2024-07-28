#include "wa.helpfile.h"

#include <string>

#include <QJsonDocument>
#include <QJsonObject>

#include "../../HelpForMax/HelpForMax.h"
#include "../common.h"

helpfile::helpfile(const atoms& args)
   : object<helpfile>()
   , ui_operator::ui_operator(this, args)
   , paint{this, "paint", minBind(this, &helpfile::paintFunction)}
   , dblclick(this, "mousedoubleclick", minBind(this, &helpfile::mouseDoubleClickFunction))
   , loopTimer(this, minBind(this, &helpfile::timerFunction))
   , patchPath()
   , socket(nullptr)
{
   socket = new QLocalSocket();
   loopTimer.delay(1000);
}

helpfile::~helpfile()
{
   delete socket;
}

atoms helpfile::paintFunction(const atoms& args, const int inlet)
{
   target render(args);

   // background
   rect<fill>{render, color{0.0, 0.0, 0.0, 1.0}};
   rect<fill>{render, color{0.3, 0.7, 0.3, 1.0}, position{10.0, 10.0}, size{20.0, -20.0}};

   return {};
}

atoms helpfile::mouseDoubleClickFunction(const atoms& args, const int inlet)
{
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

atoms helpfile::timerFunction(const atoms& args, const int inlet)
{
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

void helpfile::sendData()
{
   if (patchPath.isEmpty())
      patchPath = QString::fromStdString(Patcher::path(this));

   QJsonObject object;
   object["patch"] = patchPath;

   QJsonDocument doc(object);
   socket->write(doc.toJson(QJsonDocument::Compact));
   socket->flush();
}

void helpfile::receiveData()
{
   const QJsonDocument doc = QJsonDocument::fromJson(socket->readAll());
   const QJsonObject object = doc.object();

   const QString path = object["patch"].toString();
   if (path != patchPath)
      return;

   //Patcher::setDirty(this);

   cout << "read socket " << path.toStdString() << endl;
}

MIN_EXTERNAL(helpfile);
