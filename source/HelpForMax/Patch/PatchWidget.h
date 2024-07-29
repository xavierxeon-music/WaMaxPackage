#ifndef PatchWidgetH
#define PatchWidgetH

#include "Block.h"
#include "ui_PatchWidget.h"
#include <QScrollArea>

#include <QJsonObject>
#include <QLocalSocket>
#include <QPointer>

namespace Patch
{
   class Widget : public QScrollArea, private Block, private Ui::Widget
   {
      Q_OBJECT

   public:
      Widget(QWidget* parent);

   public:
      const QString& getPath() const;
      void openPatch(const QString& patchPath);
      virtual void writeRef();

   private:
      QString path;
      QString name;
   };

} // namespace Patch

#endif // NOT PatchWidgetH
