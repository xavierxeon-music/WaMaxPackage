#include "helpformax.h"

#include <QProcess>

#include "../common.h"

helpformax::helpformax(const atoms& args)
   : object<helpformax>()
   , ui_operator::ui_operator{this, args}
   , timestamp(this, "timestamp", "0000")
   , mousedoubleclick(this, "mousedoubleclick", minBind(this, &helpformax::mouseDoubleClickFunction))
   , paint(this, "paint", minBind(this, &helpformax::paintFunction))
   , socket()
{
   auto readFunction = std::bind(&helpformax::readSocket, this);
   QObject::connect(&socket, &QLocalSocket::readyRead, readFunction);
}

atoms helpformax::mouseDoubleClickFunction(const atoms& args, const int inlet)
{
   const char* content = timestamp.get();
   cout << "hello world " << content << endl;

   // check socket
   if (!socket.open())
   {
      QProcess::startDetached("open", {"-a", "HelpForMax"});
      //socket.connectToServer();
   }

   // connect to server

   // send info via socket

   return {};
}

atoms helpformax::paintFunction(const atoms& args, const int inlet)
{
   color bgcolor = {0.0, 0.0, 0.0, 1.0};
   color fgcolor = {0.1, 0.7, 0.1, 1.0};

   target render{args};

   // background
   rect<fill>{render, bgcolor};
   // center box
   rect<fill>{render, fgcolor, position{10.0, 10.0}, size{20.0, -20.0}};

   return {};
}

void helpformax::readSocket()
{
   cout << "read socket" << endl;
}

MIN_EXTERNAL(helpformax);
