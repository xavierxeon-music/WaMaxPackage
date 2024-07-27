
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

public:
   attribute<symbol> timestamp;

   message<> dblclick;

private:
   atoms mouseDoubleClickFunction(const atoms& args, const int inlet);

   void readSocket();

private:
   QLocalSocket socket;
};

#endif // NOT  Help4MaxH
