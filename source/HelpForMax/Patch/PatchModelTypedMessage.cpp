#include "PatchModelTypedMessage.h"

Patch::Model::TypedMessage::TypedMessage(QObject* parent, Structure* structure)
   : Abstract(parent, structure, Structure::PatchPart::MessageTyped)
{
}

void Patch::Model::TypedMessage::update()
{
}

void Patch::Model::TypedMessage::rebuild()
{
   beginResetModel();
   clear();

   setHorizontalHeaderLabels({"Type", "Active", "Description"});

   for (const Structure::DataType& type : structure->dataTypeList())
   {
      QStandardItem* typeItem = new QStandardItem(Structure::dataTypeName(type));
      typeItem->setEditable(false);

      QStandardItem* activeItem = new QStandardItem();
      activeItem->setEditable(false);
      activeItem->setCheckable(true);
      activeItem->setIcon(QIcon(":/DocMessageTyped.svg"));

      QStandardItem* descrItem = new QStandardItem();
      descrItem->setEditable(false);

      if (structure->messageTypedMap.contains(type))
      {
         activeItem->setCheckState(Qt::Checked);

         QString description = structure->messageTypedMap.value(type).digest.text;
         descrItem->setText(description);
      }

      invisibleRootItem()->appendRow({typeItem, activeItem, descrItem});
   }

   endResetModel();
}

Structure::Digest* Patch::Model::TypedMessage::getDigest(const QModelIndex& index)
{
   const QString typeName = invisibleRootItem()->child(index.row(), 0)->text();
   const Structure::DataType type = Structure::toDataType(typeName);

   Structure::Message& message = structure->messageTypedMap[type];
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
         const QString typeName = invisibleRootItem()->child(index.row(), 0)->text();
         const Structure::DataType type = Structure::toDataType(typeName);

         if (enabled)
         {
            Structure::Message message;
            message.digest.text = invisibleRootItem()->child(index.row(), 2)->text();
            structure->messageTypedMap.insert(type, message);
         }
         else
         {
            structure->messageTypedMap.remove(type);
         }

         structure->setDirty();
      }
   }

   return result;
}
