#ifndef PatchModelAbstractH
#define PatchModelAbstractH

#include <QStandardItemModel>

#include "PatchStructure.h"

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
         Abstract(QObject* parent, Structure* structure, const Structure::PatchPart& part);

      public:
         virtual void update() = 0;
         virtual void rebuild() = 0;
         virtual Structure::Digest* getDigest(const QModelIndex& index) = 0;
         const Structure::PatchPart& getPart() const;

      protected:
         Structure* structure;
         Structure::PatchPart part;
      };
   } // namespace Model
} // namespace Patch

#endif // NOT PatchModelAbstractH
