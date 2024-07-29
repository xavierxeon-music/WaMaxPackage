#ifndef PatchWidgetH
#define PatchWidgetH

#include "Block.h"
#include "ui_DigestWidget.h"
#include "ui_PatchWidget.h"
#include <QWidget>

#include <QJsonObject>
#include <QLocalSocket>
#include <QPointer>

#include "PatchModelAbstract.h"

namespace Patch
{

   class Widget : public QWidget, private Block, private Ui::PatchWidget, private Ui::DigetWidget
   {
      Q_OBJECT

   public:
      Widget(QWidget* parent);

   public:
      const QString& getPath() const;
      void openPatch(const QString& patchPath);
      virtual void writeRef();

   private:
      void setDigest(Digest* newDigest, const QString& name);
      void rebuild();
      void update();

   private:
      QString path;
      QString name;

      Model::Abstract::List modelList;

      Digest* digest;
   };

} // namespace Patch

#endif // NOT PatchWidgetH
