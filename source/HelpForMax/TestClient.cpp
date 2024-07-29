#include "TestClient.h"

#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>

#include <HelpForMax.h>

TestClient::TestClient()
   : QDialog(nullptr)
   , socket(nullptr)
{
   setupUi(this);
   socket = new QLocalSocket(this);
   connect(socket, &QLocalSocket::readyRead, this, &TestClient::slotReceiveData);

   connect(sendButton, &QPushButton::clicked, this, &TestClient::slotSendData);
}

void TestClient::slotSendData()
{
   if (!socket->waitForConnected())
   {
      if (!HelpForMax::isServerActive())
         HelpForMax::startApplication();

      socket->connectToServer(HelpForMax::compileSockerName());
      socket->waitForConnected();
   }

   QJsonObject object;
   object["patch"] = "/Volumes/ExternalData/_Home/GitHub/MusicProjects/WaMaxPackage/patchers/hardware/wa.grid.pot.maxpat";

   QJsonDocument doc(object);
   socket->write(doc.toJson(QJsonDocument::Compact));
}

void TestClient::slotReceiveData()
{
   const QJsonDocument doc = QJsonDocument::fromJson(socket->readAll());
   const QJsonObject object = doc.object();

   const QString path = object["path"].toString();

   textEdit->append(doc.toJson());
}
