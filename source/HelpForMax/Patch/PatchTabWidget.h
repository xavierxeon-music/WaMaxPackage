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
      void slotPromptLoadPatch();
      void slotLoadPatch(const QString& patchFileName);
      void slotWriteRef();
      void slotClosePatch();
      void slotCloseAllPatches();
      void slotWriteAllRefs();
      void slotOpenInMax();
      void slotOpenXML();

   private slots:
      void slotNewConnection();
      void slotWindowTitleChanged(const QString& name);
      void slotTabChanged(int index);
      void slotFillRecentMenu();
      void slotClearRecentPatches();

   private:
      void tabSelected(const Patch::Widget* pathWidget);

   private:
      QLocalServer* server;
      QStringList recentFileList;
      QMenu* recentMenu;
   };
} // namespace Patch

#endif // NOT PatchTabWidgetH
