#include "Socket.h"

#include "Server.h"

Socket::Socket(Server* server, QLocalSocket* socket)
   : QObject(server)
   , server(server)
   , socket(socket)
{
   server->socketList.append(this);

   connect(socket, &QLocalSocket::disconnected, this, &QObject::deleteLater);
   connect(socket, &QIODevice::readyRead, this, &Socket::slotReceiveData);
}

Socket::~Socket()
{
   server->socketList.removeAll(this);
}

void Socket::slotSendData()
{
}

void Socket::slotReceiveData()
{
   qDebug() << socket->readAll();
}
