#ifndef PatchModelOutputH
#define PatchModelOutputH

#include "PatchModelAbstract.h"

namespace Patch
{
   namespace Model
   {
      class Output : public Abstract
      {
         Q_OBJECT

      public:
         Output(QObject* parent, Block* block);

      private:
         void update() override;
         void rebuild() override;
      };
   } // namespace Model
} // namespace Patch

#endif // NOT PatchModelOutputH
