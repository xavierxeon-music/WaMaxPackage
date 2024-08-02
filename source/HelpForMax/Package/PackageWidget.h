#ifndef PackageWidgetH
#define PackageWidgetH

#include "PackageInfo.h"
#include "ui_PackageWidget.h"
#include <QWidget>

namespace Package
{
   class Model;

   class Widget : public QWidget, private Info, private Ui::Widget
   {
      Q_OBJECT

   public:
      Widget(QWidget* parent);

   signals:
      void signalPatchSeleted(const QString& path);

   private slots:
      void slotItemDoubleClicked(const QModelIndex& index);

   private:
      void clearContent() override;
      void createContent(const QString& packagePath) override;

   private:
      Model* model;
   };
} // namespace Package

#endif // NOT PackageWidgetH
