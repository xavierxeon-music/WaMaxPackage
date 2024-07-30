#ifndef DelegateTypeH
#define DelegateTypeH

#include <QStyledItemDelegate>

#include "Patch/Structure.h"

namespace Delegate
{
   class Type : public QStyledItemDelegate
   {
      Q_OBJECT

   public:
      struct Source
      {
         virtual Structure::Type getType(const int index) = 0;
      };

   public:
      Type(QObject* parent, Source* source);

   public:
      QWidget* createEditor(QWidget* parent, const QStyleOptionViewItem& option, const QModelIndex& index) const override;
      void setEditorData(QWidget* editor, const QModelIndex& index) const override;
      void setModelData(QWidget* editor, QAbstractItemModel* model, const QModelIndex& index) const override;
      void updateEditorGeometry(QWidget* editor, const QStyleOptionViewItem& option, const QModelIndex& index) const override;

   private:
      Source* source;
   };
} // namespace Delegate

#endif // NOT DelegateTypeH
