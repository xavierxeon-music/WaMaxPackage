#ifndef PatchModelTypedMessageH
#define PatchModelTypedMessageH

#include "PatchModelAbstract.h"

namespace Patch
{
   namespace Model
   {
      class TypedMessage : public Abstract
      {
         Q_OBJECT

      public:
         TypedMessage(QObject* parent, Block* block);

      private:
         void update() override;
         void rebuild() override;
      };
   } // namespace Model
} // namespace Patch

#endif // NOT PatchModelTypedMessageH
