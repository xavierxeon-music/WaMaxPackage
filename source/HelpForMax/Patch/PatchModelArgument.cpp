#include "PatchModelArgument.h"

Patch::Model::Argument::Argument(QObject* parent, Structure* structure)
   : Abstract(parent, structure, Structure::PatchPart::Argument)
   , Delegate::DataType::Source()
{
}

void Patch::Model::Argument::update()
{
   for (int row = 0; row < invisibleRootItem()->rowCount(); row++)
   {
      QStandardItem* nameItem = invisibleRootItem()->child(row, 0);
      QStandardItem* typeItem = invisibleRootItem()->child(row, 1);
      QStandardItem* digestItem = invisibleRootItem()->child(row, 2);

      const Structure::Argument& argument = structure->argumentList.at(row);

      nameItem->setText(argument.name);
      typeItem->setText(Structure::dataTypeName(argument.dataType));

      updateDigestItem(digestItem, argument.digest);
   }
}

void Patch::Model::Argument::rebuild()
{
   beginResetModel();

   clear();

   setHorizontalHeaderLabels({"Name", "Type", "Digest"});

   for (const Structure::Argument& argument : structure->argumentList)
   {
      QStandardItem* nameItem = new QStandardItem(argument.name);

      QStandardItem* typeItem = new QStandardItem(Structure::dataTypeName(argument.dataType));

      QStandardItem* digestItem = new QStandardItem(argument.digest.text);
      digestItem->setEditable(false);

      invisibleRootItem()->appendRow({nameItem, typeItem, digestItem});
   }

   endResetModel();

   update();
}

Patch::Structure::Digest* Patch::Model::Argument::getDigest(const QModelIndex& index)
{
   Structure::Argument& argument = structure->argumentList[index.row()];
   return &(argument.digest);
}

void Patch::Model::Argument::createBeforeItem(const QModelIndex& index)
{
   Structure::Argument argument;
   argument.name = "???";

   if (index.isValid())
      structure->argumentList.insert(index.row(), argument);
   else
      structure->argumentList.append(argument);

   structure->setDirty();
}

void Patch::Model::Argument::removeItem(const QModelIndex& index)
{
   structure->argumentList.removeAt(index.row());
   structure->setDirty();
}

bool Patch::Model::Argument::setData(const QModelIndex& index, const QVariant& value, int role)
{
   const bool result = QStandardItemModel::setData(index, value, role);
   if (Qt::EditRole == role)
   {
      Structure::Argument& argument = structure->argumentList[index.row()];

      switch (index.column())
      {
         case 0:
            argument.name = value.toString();
            structure->setDirty();
            break;
         case 1:
            argument.dataType = Structure::toDataType(value.toString());
            structure->setDirty();
            break;
         default:
            break;
      }
   }

   return result;
}

Patch::Structure::DataType Patch::Model::Argument::getDataType(const int index)
{
   const Structure::Argument& argument = structure->argumentList.at(index);

   return argument.dataType;
}
