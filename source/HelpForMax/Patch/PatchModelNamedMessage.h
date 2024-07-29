#ifndef PatchModelNamedMessageH
#define PatchModelNamedMessageH

#include "PatchModelAbstract.h"

namespace Patch
{
   namespace Model
   {
      class NamedMessage : public Abstract
      {
         Q_OBJECT

      public:
         NamedMessage(QObject* parent, Block* block);

      private:
         void update() override;
         void rebuild() override;
      };
   } // namespace Model
} // namespace Patch

#endif // NOT PatchModelNamedMessageH
