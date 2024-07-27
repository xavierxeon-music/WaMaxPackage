#include "TestClient.h"

#include <QApplication>

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

   socket->write("HELLO WORLD");
}

void TestClient::slotReceiveData()
{
   textEdit->append(QString::fromUtf8(socket->readAll()));
}

// main function

int main(int argc, char** argv)
{
   QApplication app(argc, argv);

   TestClient tc;
   tc.show();

   return app.exec();
}
