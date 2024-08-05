#ifndef PatchTabWidgetH
#define PatchTabWidgetH

#include "RecentFiles.h"
#include <QTabWidget>

#include <QLocalServer>

namespace Patch
{
   class Widget;

   class TabWidget : public QTabWidget, public RecentFiles
   {
      Q_OBJECT

   public:
      TabWidget(QWidget* parent);

   signals:
      void signalTabSelected(const QString& patchPath);

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

   private:
      void tabSelected(const Patch::Widget* pathWidget);
      Entry creatreEntry(const QFileInfo& fileInfo) override;

   private:
      QLocalServer* server;
   };
} // namespace Patch

#endif // NOT PatchTabWidgetH
