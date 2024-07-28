#include "SocketPatchWidget.h"

#include <QDateTime>
#include <QJsonDocument>

SocketPatchWidget::SocketPatchWidget(QWidget* parent, QLocalSocket* socket)
   : PatchWidget(parent)
   , socket(socket)
{
   socket->setParent(this);

   connect(socket, &QLocalSocket::disconnected, this, &QObject::deleteLater);
   connect(socket, &QIODevice::readyRead, this, &SocketPatchWidget::slotReceiveData);
}

void SocketPatchWidget::slotReceiveData()
{
   const QJsonDocument doc = QJsonDocument::fromJson(socket->readAll());
   const QJsonObject object = doc.object();

   const QString path = object["patch"].toString();

   metaObject()->invokeMethod(this, &PatchWidget::openPatch, Qt::QueuedConnection, path);
   //openPatch(path);
}

void SocketPatchWidget::writeRef()
{
   PatchWidget::writeRef();

   const QJsonObject object;
   object["timestamp"] = QDateTime::currentDateTime().toString();
   qDebug() << "SEND" << object;

   QJsonDocument doc(object);
   socket->write(doc.toJson(QJsonDocument::Compact));
}
