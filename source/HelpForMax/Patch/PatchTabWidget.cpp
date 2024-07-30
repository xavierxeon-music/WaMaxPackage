#include "PatchTabWidget.h"

#include <QDesktopServices>
#include <QFileDialog>
#include <QMenu>
#include <QSettings>

#include "HelpForMax.h"
#include "PatchSocketWidget.h"
#include "PatchWidget.h"

Patch::TabWidget::TabWidget(QWidget* parent)
   : QTabWidget(parent)
   , package()
   , server(nullptr)
   , recentFileList()
   , recentMenu(nullptr)
{
   setDocumentMode(true);
   recentMenu = new QMenu("Recent Patches", this);
   connect(recentMenu, &QMenu::aboutToShow, this, &TabWidget::slotFillRecentMenu);

   server = new QLocalServer(this);
   connect(server, &QLocalServer::newConnection, this, &TabWidget::slotNewConnection);
   qDebug() << "Server @" << HelpForMax::compileSockerName();
   server->listen(HelpForMax::compileSockerName());

   connect(this, &QTabWidget::currentChanged, this, &TabWidget::slotTabChanged);

   QSettings recentSettings;
   recentFileList = recentSettings.value("RecentPatches").toStringList();
}

Patch::TabWidget::~TabWidget()
{
   QSettings recentSettings;
   recentSettings.setValue("RecentPatches", recentFileList);
}

QMenu* Patch::TabWidget::getRecentMenu()
{
   return recentMenu;
}

void Patch::TabWidget::slotLoadPatch()
{
   const QString patchFileName = QFileDialog::getOpenFileName(this, "MAX PATCH", Package::Info::getPath(), "*.maxpat");
   if (patchFileName.isEmpty())
      return;

   openInternal(patchFileName);
}

void Patch::TabWidget::slotWriteRef()
{
   Patch::Widget* patchWidget = qobject_cast<Patch::Widget*>(currentWidget());
   if (patchWidget)
      patchWidget->writeRef();
}

void Patch::TabWidget::slotWriteAllRefs()
{
}

void Patch::TabWidget::slotClosePatch()
{
   Patch::Widget* patchWidget = qobject_cast<Patch::Widget*>(currentWidget());
   if (patchWidget)
      patchWidget->deleteLater();
}

void Patch::TabWidget::slotOpenInMax()
{
   Patch::Widget* patchWidget = qobject_cast<Patch::Widget*>(currentWidget());
   if (patchWidget)
      patchWidget->openInMax();
}

void Patch::TabWidget::slotOpenXML()
{
   Patch::Widget* patchWidget = qobject_cast<Patch::Widget*>(currentWidget());
   if (patchWidget)
      patchWidget->openXML();
}

void Patch::TabWidget::slotNewConnection()
{
   Patch::SocketWidget* patchWidget = new Patch::SocketWidget(this, server->nextPendingConnection());
   addTab(patchWidget, "???");
   connect(patchWidget, &QWidget::windowTitleChanged, this, &TabWidget::slotWindowTitleChanged);
}

void Patch::TabWidget::slotWindowTitleChanged(const QString& name)
{
   const Patch::Widget* pathWidget = qobject_cast<Patch::Widget*>(sender());
   const int index = indexOf(pathWidget);
   setTabText(index, name);

   tabSelected(pathWidget);
   setCurrentIndex(index);
}

void Patch::TabWidget::slotTabChanged(int index)
{
   const Patch::Widget* pathWidget = qobject_cast<Patch::Widget*>(widget(index));
   tabSelected(pathWidget);
}

void Patch::TabWidget::slotFillRecentMenu()
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

void Patch::TabWidget::tabSelected(const Patch::Widget* pathWidget)
{
   const QString& path = pathWidget->getPath();
   if (path.isEmpty())
      return;

   emit signalTabSelected(path);
}

bool Patch::TabWidget::openInternal(const QString& patchFileName, const QString& patchName)
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

   if (!recentFileList.contains(patchFileName))
      recentFileList.append(patchFileName);

   while (recentFileList.size() > 10)
      recentFileList.takeFirst();

   return true;
}
