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

   public:
      void create(const QString& packagePath);
   };
} // namespace Package

#endif // NOT PackageModelH
