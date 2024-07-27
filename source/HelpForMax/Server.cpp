#include "Server.h"

#include <HelpForMax.h>

Server::Server(QObject* parent)
   : QLocalServer(parent)
   , socketList()
{
   connect(this, &QLocalServer::newConnection, this, &Server::slotNewConnection);

   listen(HelpForMax::compileSockerName());
   qDebug() << "Server @" << HelpForMax::compileSockerName();
}

void Server::slotNewConnection()
{
   new Socket(this, nextPendingConnection());
}
