#ifndef PatchWidgetH
#define PatchWidgetH

#include "Data/Block.h"
#include "ui_PatchWidget.h"
#include <QWidget>

#include <QJsonObject>
#include <QLocalSocket>
#include <QPointer>

namespace Component
{
   class Model;
};

namespace Patch
{
   class Widget : public QWidget, private Block, private Ui::Widget
   {
      Q_OBJECT

   public:
      Widget(QWidget* parent);

   public:
      void openPatch(const QString& patchPath);
      virtual void writeRef();

   private:
      QString patchName;

      Component::Model* componentModel;
   };

} // namespace Patch

#endif // NOT PatchWidgetH
