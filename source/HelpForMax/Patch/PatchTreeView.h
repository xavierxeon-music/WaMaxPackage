#ifndef PatchTreeViewH
#define PatchTreeViewH

#include <QTreeView>

namespace Patch
{
   namespace Model
   {
      class Abstract;
   }

   class Widget;

   class TreeView : public QTreeView
   {
      Q_OBJECT

   public:
      TreeView(QWidget* parent);

   public:
      void init(Widget* widget, Model::Abstract* model, int forceRowHeight = -1);

   private slots:
      void slotResizeColumns();
      void slotItemClicked(const QModelIndex& index);

   private:
      Widget* widget;
      Model::Abstract* model;

      int forceRowHeight;
   };
} // namespace Patch

#endif // NOT PatchTreeViewH
