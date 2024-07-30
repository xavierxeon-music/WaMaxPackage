#ifndef PatchModelArgumentH
#define PatchModelArgumentH

#include "DelegateType.h"
#include "PatchModelAbstract.h"

namespace Patch
{
   namespace Model
   {
      class Argument : public Abstract, public Delegate::Type::Source
      {
         Q_OBJECT

      public:
         Argument(QObject* parent, Structure* structure);

      private:
         void update() override;
         void rebuild() override;
         Structure::Digest* getDigest(const QModelIndex& index) override;
         bool setData(const QModelIndex& index, const QVariant& value, int role = Qt::EditRole) override;
         Structure::DataType getType(const int index) override;
      };
   } // namespace Model
} // namespace Patch

#endif // NOT PatchModelArgumentH
