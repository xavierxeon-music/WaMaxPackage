#ifndef ComponentModelH
#define ComponentModelH

#include <QStandardItemModel>

#include "Data/Block.h"

namespace Component
{
   class Model : public QStandardItemModel
   {
      Q_OBJECT
   public:
      class Filtered;

   public:
      Model(QObject* parent, Block* block);

   public:
      void patchSelected();
      void update();
      QStandardItem* getItem(const int& row, const int& column = 0) const;

   private:
      void setModified(bool enabled, QString key);
      void rebuild();

   private:
      Block* block;
   };
} // namespace Component

#endif // NOT ComponentModelH
