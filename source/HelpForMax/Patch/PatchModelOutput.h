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
         Output(QObject* parent, Structure* structure);

      private:
         void update() override;
         void rebuild() override;
         Structure::Digest* getDigest(const QModelIndex& index) override;
      };
   } // namespace Model
} // namespace Patch

#endif // NOT PatchModelOutputH
