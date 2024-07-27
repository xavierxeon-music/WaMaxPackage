#ifndef ServerH
#define ServerH

#include <QLocalServer>
#include <QLocalSocket>
#include <QPointer>

class Server : public QLocalServer
{
   Q_OBJECT
public:
   Server(QObject* parent);

private:
   using Socket = QPointer<QLocalSocket>;

private slots:
   void slotNewConnection();
   void slotSendData();
   void slotReceiveData();

private:
   QList<Socket> socketList;
};

#endif // NOT ServerH
