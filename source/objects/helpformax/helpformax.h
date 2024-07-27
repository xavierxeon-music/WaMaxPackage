
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

public:
   attribute<symbol> timestamp;

   message<> mousedoubleclick;
   message<> paint;

private:
   atoms mouseDoubleClickFunction(const atoms& args, const int inlet);
   atoms paintFunction(const atoms& args, const int inlet);

   void readSocket();

private:
   QLocalSocket socket;
};

#endif // NOT  Help4MaxH
