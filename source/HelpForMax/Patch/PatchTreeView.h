#ifndef PatchTreeViewH
#define PatchTreeViewH

#include <QTreeView>

namespace Patch
{
   class TreeView : public QTreeView
   {
      Q_OBJECT

   public:
      TreeView(QWidget* parent = nullptr);
   };
} // namespace Patch

#endif // NOT PatchTreeViewH
