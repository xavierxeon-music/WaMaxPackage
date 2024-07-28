#include "helpformax.h"

#include <string>

#include <QJsonDocument>
#include <QJsonObject>

#include "../../common/HelpForMax.h"
#include "../common.h"

helpformax::helpformax(const atoms& args)
   : object<helpformax>()
   , timestamp(this, "timestamp", "0000")
   , dblclick(this, "dblclick", minBind(this, &helpformax::mouseDoubleClickFunction))
   , loopTimer{this, minBind(this, &helpformax::timerFunction)}
   , socket(nullptr)
{
   socket = new QLocalSocket();
   loopTimer.delay(1000);
}

helpformax::~helpformax()
{
   delete socket;
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

QString helpformax::compilePatchPath()
{
   using namespace c74;

   max::t_object* max_patch_instance = static_cast<max::t_object*>(patcher());
   const char* patchPath = max::jpatcher_get_filepath(max_patch_instance)->s_name;

   return patchPath;
}

void helpformax::sendData()
{
   QJsonObject object;
   object["patch"] = compilePatchPath();
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
   if (path != compilePatchPath())
      return;

   const QString ts = object["timestamp"].toString();
   timestamp = ts.toStdString();

   cout << "read socket " << path.toStdString() << " " << timestamp.get() << endl;
}

MIN_EXTERNAL(helpformax);
