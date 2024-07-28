
#ifndef Help4MaxH
#define Help4MaxH

#include "c74_min.h"
using namespace c74::min;
using namespace c74::min::ui;

#include <QLocalSocket>

class helpformax : public object<helpformax>, public ui_operator<40, 40>
{
public:
   MIN_DESCRIPTION{"open help editor"};

public:
   helpformax(const atoms& args = {});
   ~helpformax();

public:
   attribute<symbol> timestamp;

   message<> paint;
   message<> dblclick;
   timer<timer_options::defer_delivery> loopTimer;

private:
   atoms paintFunction(const atoms& args, const int inlet);
   atoms mouseDoubleClickFunction(const atoms& args, const int inlet);
   atoms timerFunction(const atoms& args, const int inlet);

   void sendData();
   void receiveData();

private:
   QString patchPath;
   QLocalSocket* socket;
};

#endif // NOT  Help4MaxH
