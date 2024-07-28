#ifndef TabWidgetH
#define TabWidgetH

#include <QTabWidget>

#include <QLocalServer>

#include "Block/Package.h"

class TabWidget : public QTabWidget
{
   Q_OBJECT

public:
   TabWidget(QWidget* parent);

public slots:
   void slotOpenPatch();
   void slotWriteRef();
   void slotClosePatch();

private slots:
   void slotNewConnection();
   void slotWindowTitleChanged(const QString& name);

private:
   Package package;
   QLocalServer* server;
};

#endif // NOT TabWidgetH
