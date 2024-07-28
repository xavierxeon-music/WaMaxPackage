#include "TabWidget.h"

#include <QFileDialog>

#include "Edit/PatchWidget.h"
#include "Edit/SocketPatchWidget.h"
#include "HelpForMax.h"

TabWidget::TabWidget(QWidget* parent)
   : QTabWidget(parent)
   , package()
   , server(nullptr)
{
   setDocumentMode(true);

   server = new QLocalServer(this);
   connect(server, &QLocalServer::newConnection, this, &TabWidget::slotNewConnection);

   qDebug() << "Server @" << HelpForMax::compileSockerName();
   server->listen(HelpForMax::compileSockerName());
}

void TabWidget::slotOpenPatch()
{
   const QString patchFileName = QFileDialog::getOpenFileName(this, "MAX PATCH", Package::getPath(), "*.maxpat");
   if (patchFileName.isEmpty())
      return;

   PatchWidget* patchWidget = new PatchWidget(this);
   addTab(patchWidget, "???");
   connect(patchWidget, &QWidget::windowTitleChanged, this, &TabWidget::slotWindowTitleChanged);

   patchWidget->openPatch(patchFileName);
}

void TabWidget::slotWriteRef()
{
   PatchWidget* patchWidget = qobject_cast<PatchWidget*>(currentWidget());
   patchWidget->writeRef();
}

void TabWidget::slotClosePatch()
{
   PatchWidget* patchWidget = qobject_cast<PatchWidget*>(currentWidget());
   patchWidget->deleteLater();
}

void TabWidget::slotNewConnection()
{
   SocketPatchWidget* patchWidget = new SocketPatchWidget(this, server->nextPendingConnection());
   addTab(patchWidget, "???");
   connect(patchWidget, &QWidget::windowTitleChanged, this, &TabWidget::slotWindowTitleChanged);
}

void TabWidget::slotWindowTitleChanged(const QString& name)
{
   const PatchWidget* widget = qobject_cast<PatchWidget*>(sender());
   const int index = indexOf(widget);
   setTabText(index, name);
}
