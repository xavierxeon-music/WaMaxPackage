#ifndef TestClientH
#define TestClientH

#include "ui_TestClient.h"
#include <QWidget>

#include <QLocalSocket>

class TestClient : public QWidget, private Ui::TestClient
{
   Q_OBJECT

public:
   TestClient();

private slots:
   void slotSendData();
   void slotReceiveData();

private:
   QLocalSocket* socket;
};

#endif // NOT TestClientH
