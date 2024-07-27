#include "helpformax.h"

#include <string>

#include <QProcess>

#include "../common.h"

helpformax::helpformax(const atoms& args)
   : object<helpformax>()
   , timestamp(this, "timestamp", "0000")
   , dblclick(this, "dblclick", minBind(this, &helpformax::mouseDoubleClickFunction))
   , socket()
{
   auto readFunction = std::bind(&helpformax::readSocket, this);
   QObject::connect(&socket, &QLocalSocket::readyRead, readFunction);
}

atoms helpformax::mouseDoubleClickFunction(const atoms& args, const int inlet)
{
   using namespace c74;

   max::t_object* max_patch_instance = static_cast<max::t_object*>(patcher());
   const std::string patchPath = max::jpatcher_get_filepath(max_patch_instance)->s_name;

   const std::string ts = timestamp.get();
   cout << "hello world " << ts << " " << patchPath << endl;

   // check socket
   if (!socket.open())
   {
      // QProcess::startDetached("open", {"-a", "HelpForMax"});
      //socket.connectToServer();
   }

   // connect to server

   // send info via socket

   return {};
}

void helpformax::readSocket()
{
   cout << "read socket" << endl;
}

MIN_EXTERNAL(helpformax);
