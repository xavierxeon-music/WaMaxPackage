#include "PatchWidget.h"

#include "ServerTabWidget.h"

PatchWidget::PatchWidget(ServerTabWidget* server, QLocalSocket* socket)
   : QWidget(server)
   , server(server)
   , socket(socket)
{
   setupUi(this);

   connect(socket, &QLocalSocket::disconnected, this, &QObject::deleteLater);
   connect(socket, &QIODevice::readyRead, this, &PatchWidget::slotReceiveData);
}

void PatchWidget::sendData()
{
   socket->write("YOU SUCK");
}

void PatchWidget::slotReceiveData()
{
   textEdit->append(QString::fromUtf8(socket->readAll()));
}
