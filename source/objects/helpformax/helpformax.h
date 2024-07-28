
#ifndef Help4MaxH
#define Help4MaxH

#include "c74_min.h"
using namespace c74::min;

#include <QLocalSocket>

class helpformax : public object<helpformax>
{
public:
   MIN_DESCRIPTION{"open help editor"};

public:
   helpformax(const atoms& args = {});
   ~helpformax();

public:
   attribute<symbol> timestamp;

   message<> dblclick;
   timer<timer_options::defer_delivery> loopTimer;

private:
   atoms mouseDoubleClickFunction(const atoms& args, const int inlet);
   atoms timerFunction(const atoms& args, const int inlet);

   QString compilePatchPath();
   void sendData();
   void receiveData();

private:
   QLocalSocket* socket;
};

#endif // NOT  Help4MaxH
