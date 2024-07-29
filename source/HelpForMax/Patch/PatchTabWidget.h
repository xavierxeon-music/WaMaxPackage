#ifndef PatchTabWidgetH
#define PatchTabWidgetH

#include <QTabWidget>

#include <QLocalServer>

#include "Package/PackageInfo.h"

namespace Patch
{
   class Widget;

   class TabWidget : public QTabWidget
   {
      Q_OBJECT

   public:
      TabWidget(QWidget* parent);
      ~TabWidget();

   signals:
      void signalTabSelected(const QString& patchPath);

   public:
      QMenu* getRecentMenu();

   public slots:
      void slotOpenPatch();
      void slotWriteRef();
      void slotClosePatch();

   private slots:
      void slotNewConnection();
      void slotWindowTitleChanged(const QString& name);
      void slotFillRecentMenu();
      void slotTabChanged(int index);

   private:
      void tabSelected(const Patch::Widget* pathWidget);
      bool openInternal(const QString& patchFileName, const QString& patchName = QString());

   private:
      Package::Info package;
      QLocalServer* server;
      QStringList recentFileList;
      QMenu* recentMenu;
   };
} // namespace Patch

#endif // NOT PatchTabWidgetH
