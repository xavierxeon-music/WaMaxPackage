#include "ServerTabWidget.h"

#include <HelpForMax.h>

#include "PatchWidget.h"

ServerTabWidget::ServerTabWidget(QWidget* parent)
   : QTabWidget(parent)
   , server(nullptr)
{
   server = new QLocalServer(this);
   connect(server, &QLocalServer::newConnection, this, &ServerTabWidget::slotNewConnection);

   qDebug() << "Server @" << HelpForMax::compileSockerName();
   server->listen(HelpForMax::compileSockerName());
}

void ServerTabWidget::slotSaveCurrentPatch()
{
   PatchWidget* patchWidget = qobject_cast<PatchWidget*>(currentWidget());
   patchWidget->sendData();
}

void ServerTabWidget::slotNewConnection()
{
   PatchWidget* patchWidget = new PatchWidget(this, server->nextPendingConnection());
   addTab(patchWidget, "???");
}
