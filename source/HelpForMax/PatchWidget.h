#ifndef PatchWidgetH
#define PatchWidgetH

#include "ui_PatchWidget.h"
#include <QWidget>

#include <QLocalSocket>
#include <QPointer>

class ServerTabWidget;

class PatchWidget : public QWidget, private Ui::PatchWidget
{
   Q_OBJECT

public:
   PatchWidget(ServerTabWidget* server, QLocalSocket* socket);

public:
   void sendData();

private slots:
   void slotReceiveData();

private:
   ServerTabWidget* server;
   QPointer<QLocalSocket> socket;
};

#endif // NOT PatchWidgetH
