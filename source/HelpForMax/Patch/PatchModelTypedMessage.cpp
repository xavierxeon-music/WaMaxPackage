#include "PatchModelTypedMessage.h"

Patch::Model::TypedMessage::TypedMessage(QObject* parent, Structure* structure)
   : Abstract(parent, structure, Structure::PatchPart::MessageTyped)
{
}

void Patch::Model::TypedMessage::update()
{
   for (int row = 0; row < invisibleRootItem()->rowCount(); row++)
   {
      QStandardItem* typeItem = invisibleRootItem()->child(row, 0);
      QStandardItem* activeItem = invisibleRootItem()->child(row, 1);
      QStandardItem* digestItem = invisibleRootItem()->child(row, 2);

      const Structure::DataType type = typeItem->data().value<Structure::DataType>();
      Structure::MessageTyped& message = structure->messageTypedMap[type];

      activeItem->setCheckState(message.active ? Qt::Checked : Qt::Unchecked);

      updateDigestItem(digestItem, message.digest);
   }
}

void Patch::Model::TypedMessage::rebuild()
{
   beginResetModel();
   clear();

   setHorizontalHeaderLabels({"Type", "Active", "Digest"});

   for (const Structure::DataType& type : structure->dataTypeList())
   {
      QStandardItem* typeItem = new QStandardItem(Structure::dataTypeName(type));
      typeItem->setEditable(false);
      typeItem->setData(QVariant::fromValue(type));

      QStandardItem* activeItem = new QStandardItem();
      activeItem->setEditable(false);
      activeItem->setCheckable(true);
      activeItem->setIcon(QIcon(":/DocMessageTyped.svg"));

      QStandardItem* digestItem = new QStandardItem();
      digestItem->setEditable(false);

      invisibleRootItem()->appendRow({typeItem, activeItem, digestItem});
   }

   endResetModel();

   update();
}

Patch::Structure::Digest* Patch::Model::TypedMessage::getDigest(const QModelIndex& index)
{
   const QString typeName = invisibleRootItem()->child(index.row(), 0)->text();
   const Structure::DataType type = Structure::toDataType(typeName);

   Structure::MessageTyped& message = structure->messageTypedMap[type];
   return &(message.digest);
}

bool Patch::Model::TypedMessage::setData(const QModelIndex& index, const QVariant& value, int role)
{
   const bool result = QStandardItemModel::setData(index, value, role);

   if (Qt::CheckStateRole == role)
   {
      const bool enabled = (Qt::Checked == value.toInt());

      if (1 == index.column())
      {
         const Structure::DataType type = invisibleRootItem()->child(index.row(), 0)->data().value<Structure::DataType>();

         Structure::MessageTyped& message = structure->messageTypedMap[type];
         if (enabled)
         {
            message.active = true;
            message.digest.text = invisibleRootItem()->child(index.row(), 2)->text();
         }
         else
         {
            message.active = false;
         }

         structure->setDirty();
      }
   }

   return result;
}
