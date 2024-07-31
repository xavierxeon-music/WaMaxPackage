#include "PatchSocketWidget.h"

#include <QDateTime>
#include <QJsonDocument>

Patch::SocketWidget::SocketWidget(QWidget* parent, QLocalSocket* socket)
   : Widget(parent)
   , socket(socket)
{
   socket->setParent(this);

   connect(socket, &QLocalSocket::disconnected, this, &QObject::deleteLater);
   connect(socket, &QIODevice::readyRead, this, &SocketWidget::slotReceiveData);
}

void Patch::SocketWidget::slotReceiveData()
{
   const QJsonDocument doc = QJsonDocument::fromJson(socket->readAll());
   const QJsonObject object = doc.object();

   const QString newPath = object["patch"].toString();
   if (path == newPath)
      return;

   //metaObject()->invokeMethod(this, &Widget::openPatch, Qt::QueuedConnection, newPath);
   openPatch(newPath);
}

void Patch::SocketWidget::writeRef()
{
   Widget::writeRef();

   QJsonObject object;
   object["patch"] = path;
   qDebug() << "SEND" << object;

   QJsonDocument doc(object);
   socket->write(doc.toJson(QJsonDocument::Compact));
}
