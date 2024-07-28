#include "TestClient.h"

#include <QApplication>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>

#include <HelpForMax.h>

TestClient::TestClient()
   : QWidget(nullptr)
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
   object["timestamp"] = QDateTime::currentDateTime().toString(Qt::ISODate);
   object["description"] = "a knob on a grid";

   QJsonArray arguments;
   arguments.append("the grid ID if the element (default 11)\n11 12 13 14\n21 22 23 24\n31 32 33 34\n41 42 43 44");
   object["arguments"] = arguments;

   QJsonArray messagesAndAttributes;
   messagesAndAttributes.append("[@M, symbol, color] the color of the LED");
   messagesAndAttributes.append("[@M, symbol, name] some name to show in UI");
   object["messages"] = messagesAndAttributes;

   QJsonArray outputs;
   outputs.append("[rgb] rgb value of current color as float");
   outputs.append("[value] the value of the element (on change)");
   object["outputs"] = outputs;

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

// main function

int main(int argc, char** argv)
{
   QApplication app(argc, argv);

   TestClient tc;
   tc.show();

   return app.exec();
}
