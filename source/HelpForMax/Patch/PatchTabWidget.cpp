#include "PatchTabWidget.h"

#include <QDesktopServices>
#include <QFileDialog>
#include <QMenu>
#include <QSettings>

#include "HelpForMax.h"
#include "Package/PackageInfo.h"
#include "PatchSocketWidget.h"
#include "PatchWidget.h"

Patch::TabWidget::TabWidget(QWidget* parent)
   : QTabWidget(parent)
   , RecentFiles(this, "Patch/Recent")
   , server(nullptr)
{
   setDocumentMode(true);

   server = new QLocalServer(this);
   connect(server, &QLocalServer::newConnection, this, &TabWidget::slotNewConnection);
   qDebug() << "Server @" << HelpForMax::compileSockerName();
   server->listen(HelpForMax::compileSockerName());

   connect(this, &QTabWidget::currentChanged, this, &TabWidget::slotTabChanged);
}

void Patch::TabWidget::slotPromptLoadPatch()
{
   const QString patchFileName = QFileDialog::getOpenFileName(this, "MAX PATCH", Package::Info::getPath(), "*.maxpat");
   if (patchFileName.isEmpty())
      return;

   slotLoadPatch(patchFileName);
}

void Patch::TabWidget::slotLoadPatch(const QString& patchFileName)
{
   QFileInfo patchInfo(patchFileName);
   const QString patchName = patchInfo.fileName().replace(".maxpat", "");

   for (int index = 0; index < tabBar()->count(); index++)
   {
      if (patchName == tabText(index))
         return;
   }

   Patch::Widget* patchWidget = new Patch::Widget(this);
   addTab(patchWidget, "???");
   connect(patchWidget, &QWidget::windowTitleChanged, this, &TabWidget::slotWindowTitleChanged);

   patchWidget->openPatch(patchFileName);
   addRecentFile(patchFileName);
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

void Patch::TabWidget::slotCloseAllPatches()
{
   QList<QWidget*> deleteList;
   for (int index = 0; index < tabBar()->count(); index++)
   {
      deleteList.append(widget(index));
   }

   for (QWidget* widget : deleteList)
      widget->deleteLater();
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
   if (index < 0)
   {
      //"no tab left"
      emit signalTabSelected("");
      return;
   }

   const Patch::Widget* pathWidget = qobject_cast<Patch::Widget*>(widget(index));
   tabSelected(pathWidget);
}

void Patch::TabWidget::tabSelected(const Patch::Widget* pathWidget)
{
   const QString& path = pathWidget->getPath();
   if (path.isEmpty())
      return;

   emit signalTabSelected(path);
}

RecentFiles::Entry Patch::TabWidget::creatreEntry(const QFileInfo& fileInfo)
{
   const QString patchName = fileInfo.completeBaseName();
   auto openFunction = std::bind(&TabWidget::slotLoadPatch, this, fileInfo.absoluteFilePath());

   Entry entry{patchName, openFunction};
   return entry;
}
