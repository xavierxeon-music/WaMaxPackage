#include "MessageBar.h"

#include "MessageChannel.h"

Message::Bar* Message::Bar::me = nullptr;

Message::Bar::Bar(QWidget* parent)
   : QStatusBar(parent)
   , messageChannel(nullptr)
   , warningChannel(nullptr)
{
   me = this;
   messageChannel = new Channel(this, false);
   warningChannel = new Channel(this, true);

   setSizeGripEnabled(false);
}

Message::Bar::~Bar()
{
   me = nullptr;
}

QTextStream Message::Bar::message()
{
   if (!me)
      return QTextStream();

   return QTextStream(me->messageChannel);
}

QTextStream Message::Bar::warning()
{
   if (!me)
      return QTextStream();

   return QTextStream(me->warningChannel);
}

void Message::Bar::print(const QString& text, bool isWarning)
{
   static const QString urgentSymbol = QString::fromUtf8("\u2622");
   if (isWarning)
      showMessage(urgentSymbol + " " + text);
   else
      showMessage(text, 2000);
}
