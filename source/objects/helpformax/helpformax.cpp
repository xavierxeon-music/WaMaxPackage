#include "helpformax.h"

#include <string>

#include <QJsonDocument>
#include <QJsonObject>

#include "../../common/HelpForMax.h"
#include "../common.h"

helpformax::helpformax(const atoms& args)
   : object<helpformax>()
   , ui_operator::ui_operator(this, args)
   , timestamp(this, "timestamp", "0000")
   , paint{this, "paint", minBind(this, &helpformax::paintFunction)}
   , dblclick(this, "mousedoubleclick", minBind(this, &helpformax::mouseDoubleClickFunction))
   , loopTimer(this, minBind(this, &helpformax::timerFunction))
   , patchPath()
   , socket(nullptr)
{
   socket = new QLocalSocket();
   loopTimer.delay(1000);
}

helpformax::~helpformax()
{
   delete socket;
}

atoms helpformax::paintFunction(const atoms& args, const int inlet)
{
   target render(args);

   // background
   rect<fill>{render, color{0.0, 0.0, 0.0, 1.0}};
   rect<fill>{render, color{0.3, 0.7, 0.3, 1.0}, position{10.0, 10.0}, size{20.0, -20.0}};

   return {};
}

atoms helpformax::mouseDoubleClickFunction(const atoms& args, const int inlet)
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

atoms helpformax::timerFunction(const atoms& args, const int inlet)
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

void helpformax::sendData()
{
   if (patchPath.isEmpty())
      patchPath = QString::fromStdString(Patcher::path(this));

   QJsonObject object;
   object["patch"] = patchPath;
   object["timestamp"] = QString(timestamp.get());

   QJsonDocument doc(object);
   socket->write(doc.toJson(QJsonDocument::Compact));
   socket->flush();
}

void helpformax::receiveData()
{
   const QJsonDocument doc = QJsonDocument::fromJson(socket->readAll());
   const QJsonObject object = doc.object();

   const QString path = object["patch"].toString();
   if (path != patchPath)
      return;

   const QString ts = object["timestamp"].toString();
   timestamp = ts.toStdString();
   Patcher::setDirty(this);

   cout << "read socket " << path.toStdString() << " " << timestamp.get() << endl;
}

MIN_EXTERNAL(helpformax);
