#include "HelpForMax.h"

#include <QDebug>

#include <QDir>
#include <QFile>
#include <QLocalSocket>
#include <QProcess>
#include <QStandardPaths>

HelpForMax::HelpForMax()
{
}

QString HelpForMax::compileSockerName()
{
   const QString socketPath = QStandardPaths::writableLocation(QStandardPaths::HomeLocation);
   // QDir().mkpath(socketPath);

   const QString socketName = socketPath + "/.helpformax.socket";
   return socketName;
}

bool HelpForMax::isServerActive()
{
   const QString socketName = compileSockerName();
   if (!QFile::exists(socketName))
      return false;

   QLocalSocket socket;
   socket.connectToServer(socketName);
   if (socket.waitForConnected())
   {
      socket.disconnectFromServer();
      return true;
   }

   if (!QFile::remove(socketName))
      return true;

   return false;
}

void HelpForMax::startApplication()
{
   qDebug() << "START APP";
}
