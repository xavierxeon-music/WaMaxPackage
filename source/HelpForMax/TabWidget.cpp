#include "TabWidget.h"

#include <QFileDialog>
#include <QMenu>
#include <QSettings>

#include "Edit/PatchSocketWidget.h"
#include "Edit/PatchWidget.h"
#include "HelpForMax.h"

TabWidget::TabWidget(QWidget* parent)
   : QTabWidget(parent)
   , package()
   , server(nullptr)
   , recentFileList()
   , recentMenu(nullptr)
{
   setDocumentMode(true);
   recentMenu = new QMenu("Recent", this);
   connect(recentMenu, &QMenu::aboutToShow, this, &TabWidget::slotFillRecentMenu);

   server = new QLocalServer(this);
   connect(server, &QLocalServer::newConnection, this, &TabWidget::slotNewConnection);

   qDebug() << "Server @" << HelpForMax::compileSockerName();
   server->listen(HelpForMax::compileSockerName());

   QSettings recentSettings;
   recentFileList = recentSettings.value("RecentPatches").toStringList();
}

TabWidget::~TabWidget()
{
   QSettings recentSettings;
   recentSettings.setValue("RecentPatches", recentFileList);
}

QMenu* TabWidget::getRecentMenu()
{
   return recentMenu;
}

void TabWidget::slotOpenPatch()
{
   const QString patchFileName = QFileDialog::getOpenFileName(this, "MAX PATCH", Package::getPath(), "*.maxpat");
   if (patchFileName.isEmpty())
      return;

   if (openInternal(patchFileName))
   {
      recentFileList.append(patchFileName);
      while (recentFileList.size() > 10)
         recentFileList.takeFirst();
   }
}

void TabWidget::slotWriteRef()
{
   Patch::Widget* patchWidget = qobject_cast<Patch::Widget*>(currentWidget());
   patchWidget->writeRef();
}

void TabWidget::slotClosePatch()
{
   Patch::Widget* patchWidget = qobject_cast<Patch::Widget*>(currentWidget());
   patchWidget->deleteLater();
}

void TabWidget::slotNewConnection()
{
   Patch::SocketWidget* patchWidget = new Patch::SocketWidget(this, server->nextPendingConnection());
   addTab(patchWidget, "???");
   connect(patchWidget, &QWidget::windowTitleChanged, this, &TabWidget::slotWindowTitleChanged);
}

void TabWidget::slotWindowTitleChanged(const QString& name)
{
   const Patch::Widget* widget = qobject_cast<Patch::Widget*>(sender());
   const int index = indexOf(widget);
   setTabText(index, name);
}

void TabWidget::slotFillRecentMenu()
{
   recentMenu->clear();
   for (const QString& patchFileName : recentFileList)
   {
      QFileInfo patchInfo(patchFileName);
      const QString patchName = patchInfo.fileName().replace(".maxpat", "");
      auto openFunction = std::bind(&TabWidget::openInternal, this, patchFileName, patchName);
      recentMenu->addAction(patchName, openFunction);
   }
}

bool TabWidget::openInternal(const QString& patchFileName, const QString& patchName)
{
   for (int index = 0; index < tabBar()->count(); index++)
   {
      if (patchName == tabText(index))
         return false;
   }

   Patch::Widget* patchWidget = new Patch::Widget(this);
   addTab(patchWidget, "???");
   connect(patchWidget, &QWidget::windowTitleChanged, this, &TabWidget::slotWindowTitleChanged);

   patchWidget->openPatch(patchFileName);

   return true;
}
