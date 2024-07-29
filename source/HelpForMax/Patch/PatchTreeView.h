#ifndef PatchTreeViewH
#define PatchTreeViewH

#include <QTreeView>

namespace Patch
{
   namespace Model
   {
      class Abstract;
   }

   class TreeView : public QTreeView
   {
      Q_OBJECT

   public:
      TreeView(QWidget* parent = nullptr);

   public:
      void init(Model::Abstract* model);

   private slots:
      void slotResizeColumns();
      void slotItemDoubleClicked(const QModelIndex& index);

   private:
      Model::Abstract* model;
   };
} // namespace Patch

#endif // NOT PatchTreeViewH
