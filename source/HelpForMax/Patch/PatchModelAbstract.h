#ifndef PatchModelAbstractH
#define PatchModelAbstractH

#include <QStandardItemModel>

#include "Block.h"
#include "TypeDelegate.h"

namespace Patch
{
   namespace Model
   {
      class Abstract : public QStandardItemModel, public TypeDelegate::Proxy
      {
         Q_OBJECT
      public:
         using List = QList<Abstract*>;

      public:
         Abstract(QObject* parent, Block* block);

      public:
         virtual void update() = 0;
         virtual void rebuild() = 0;
         virtual Structure::Type getType(const int index);

      protected:
         Block* block;
      };
   } // namespace Model
} // namespace Patch

#endif // NOT PatchModelAbstractH
