#include "PatchWidget.h"

#include <QDateTime>
#include <QJsonDocument>

#include "ServerTabWidget.h"

PatchWidget::PatchWidget(ServerTabWidget* server, QLocalSocket* socket)
   : QWidget(server)
   , server(server)
   , socket(socket)
   , object()
{
   setupUi(this);

   connect(socket, &QLocalSocket::disconnected, this, &QObject::deleteLater);
   connect(socket, &QIODevice::readyRead, this, &PatchWidget::slotReceiveData);
}

void PatchWidget::sendData()
{
   object["timestamp"] = QDateTime::currentDateTime().toString();
   qDebug() << "SEND" << object;

   QJsonDocument doc(object);
   socket->write(doc.toJson(QJsonDocument::Compact));
}

void PatchWidget::slotReceiveData()
{
   const QJsonDocument doc = QJsonDocument::fromJson(socket->readAll());
   object = doc.object();

   qDebug() << "RECEIVE" << object;

   const QString path = object["patch"].toString();

   textEdit->append(path);
}
