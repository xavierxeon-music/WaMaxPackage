#ifndef TestClientH
#define TestClientH

#include "ui_TestClient.h"
#include <QDialog>

#include <QLocalSocket>

class TestClient : public QDialog, private Ui::TestClient
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
