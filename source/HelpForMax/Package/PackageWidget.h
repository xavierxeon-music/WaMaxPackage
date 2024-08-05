#ifndef PackageWidgetH
#define PackageWidgetH

#include "PackageInfo.h"
#include "RecentFiles.h"
#include "ui_PackageWidget.h"
#include <QWidget>

namespace Package
{
   class Model;

   class Widget : public QWidget, public RecentFiles, private Info, private Ui::Widget
   {
      Q_OBJECT

   public:
      Widget(QWidget* parent);

   signals:
      void signalCloseAllPatches();
      void signalPatchSeleted(const QString& path);

   public slots:
      void slotLoadPackage();
      void slotClosePackage();

   private slots:
      void slotItemDoubleClicked(const QModelIndex& index);

   private:
      void clear() override;
      void create(const QString& packagePath) override;
      Entry creatreEntry(const QFileInfo& fileInfo) override;

   private:
      Model* model;
   };
} // namespace Package

#endif // NOT PackageWidgetH
