#ifndef PackageModelH
#define PackageModelH

#include <QStandardItemModel>

namespace Package
{
   class Model : public QStandardItemModel
   {
      Q_OBJECT

   public:
      Model(QObject* parent);
   };
} // namespace Package

#endif // NOT PackageModelH
