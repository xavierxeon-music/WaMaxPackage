#ifndef SocketH
#define SocketH

#include <QObject>

#include <QLocalSocket>
#include <QPointer>

class Server;

class Socket : public QObject
{
   Q_OBJECT

public:
   using List = QList<Socket*>;

public:
   Socket(Server* server, QLocalSocket* socket);
   ~Socket();

private slots:
   void slotSendData();
   void slotReceiveData();

private:
   Server* server;
   QPointer<QLocalSocket> socket;
};

#endif // NOT SocketH
