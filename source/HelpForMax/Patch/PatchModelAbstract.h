#ifndef PatchModelAbstractH
#define PatchModelAbstractH

#include <QStandardItemModel>

#include "Structure.h"

namespace Patch
{
   namespace Model
   {
      class Abstract : public QStandardItemModel
      {
         Q_OBJECT
      public:
         using List = QList<Abstract*>;

      public:
         Abstract(QObject* parent, Structure* structure);

      public:
         virtual void update() = 0;
         virtual void rebuild() = 0;
         virtual Structure::Digest* getDigest(const QModelIndex& index) = 0;

      protected:
         Structure* structure;
      };
   } // namespace Model
} // namespace Patch

#endif // NOT PatchModelAbstractH
