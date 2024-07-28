#ifndef MessageBarH
#define MessageBarH

#include <QStatusBar>

class MessageBar : public QStatusBar
{
   Q_OBJECT

public:
   MessageBar(QWidget* parent);
};

#endif // NOT MessageBarH
