
#ifndef WaHelpFileH
#define WaHelpFileH

#include "c74_min.h"
using namespace c74::min;
using namespace c74::min::ui;

#include <QLocalSocket>

class helpfile : public object<helpfile>, public ui_operator<40, 40>
{
public:
   MIN_DESCRIPTION{"open help editor"};

public:
   helpfile(const atoms& args = {});
   ~helpfile();

public:
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

#endif // NOT  WaHelpFileH
