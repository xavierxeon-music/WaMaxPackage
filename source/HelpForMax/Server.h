#ifndef ServerH
#define ServerH

#include <QLocalServer>

#include "Socket.h"

class Server : public QLocalServer
{
   Q_OBJECT

public:
   Server(QObject* parent);

private:
   friend class Socket;

private slots:
   void slotNewConnection();

private:
   Socket::List socketList;
};

#endif // NOT ServerH
