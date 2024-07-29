#ifndef PackageViewH
#define PackageViewH

#include <QTreeView>

namespace Package
{
   class View : public QTreeView
   {
      Q_OBJECT

   public:
      View(QWidget* parent);
   };
} // namespace Package

#endif // NOT PackageViewH
