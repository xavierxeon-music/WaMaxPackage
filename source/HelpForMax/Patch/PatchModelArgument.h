#ifndef PatchModelArgumentH
#define PatchModelArgumentH

#include "PatchModelAbstract.h"

namespace Patch
{
   namespace Model
   {
      class Argument : public Abstract
      {
         Q_OBJECT

      public:
         Argument(QObject* parent, Block* block);

      private:
         void update() override;
         void rebuild() override;
         Structure::Type getType(const int index) override;
      };
   } // namespace Model
} // namespace Patch

#endif // NOT PatchModelArgumentH
