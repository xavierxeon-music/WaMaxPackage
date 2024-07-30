
#ifndef WaHelpFileH
#define WaHelpFileH

#include "c74_min.h"
using namespace c74::min;
using namespace c74::min::ui;

#include <QLocalSocket>

class HelpFile : public object<HelpFile>, public ui_operator<40, 40>
{
public:
   MIN_DESCRIPTION{"open help editor"};

public:
   HelpFile(const atoms& args = {});
   ~HelpFile();

public:
   message<> paint;
   message<> dblclick;
   timer<timer_options::defer_delivery> loopTimer;

private:
   enum class State
   {
      Initial,
      NotInPackage,
      HelpFileOutdated,
      UpToDate
   };

private:
   atoms paintFunction(const atoms& args, const int inlet);
   atoms mouseDoubleClickFunction(const atoms& args, const int inlet);
   atoms timerFunction(const atoms& args, const int inlet);

   void sendData();
   void receiveData();
   void checkState();

private:
   QString patchPath;
   QString refPath;
   QLocalSocket* socket;
   State state;
};

#endif // NOT  WaHelpFileH
