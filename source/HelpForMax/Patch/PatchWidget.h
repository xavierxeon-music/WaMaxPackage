#ifndef PatchWidgetH
#define PatchWidgetH

#include "Structure.h"
#include "ui_DigestWidget.h"
#include "ui_PatchWidget.h"
#include <QWidget>

#include <QJsonObject>
#include <QLocalSocket>
#include <QPointer>

#include "PatchModelAbstract.h"

namespace Patch
{
   class Widget : public QWidget, private Structure, private Ui::PatchWidget, private Ui::DigestWidget
   {
      Q_OBJECT

   public:
      Widget(QWidget* parent);

   public:
      const QString& getPath() const;
      void openPatch(const QString& patchPath);
      virtual void writeRef();
      void openInMax();
      void openXML();
      bool isDirty() const;

   private:
      friend class TreeView;

   private slots:
      void slotPatchTypeChanged(int index);
      void slotSetPatchDigest();
      void slotSaveDigestText();
      void slotSaveDigestDescription();

   private:
      void setDigest(Digest* newDigest, const PatchPart& part);
      void rebuild();
      void update();
      void setDirty() override;
      void propagateDirty(bool isDirty);
      void setIcon(QLabel* iconLabel, Structure::PatchPart part);

   private:
      QString path;
      QString name;

      Model::Abstract::List modelList;
      bool dirty;

      Digest* digest;
   };

} // namespace Patch

#endif // NOT PatchWidgetH
