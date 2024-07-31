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

   emit signalDataEdited();
}

void Patch::Model::Argument::rebuild()
{
   beginResetModel();

   clear();

   setHorizontalHeaderLabels({"Name", "Type", "Digest"});

   for (int row = 0; row < structure->argumentList.count(); row++)
   {
      QStandardItem* nameItem = new QStandardItem();

      QStandardItem* typeItem = new QStandardItem();

      QStandardItem* digestItem = new QStandardItem();
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

      if (0 == index.column())
      {
         argument.name = value.toString();
         structure->setDirty();
      }
      else if (1 == index.column())
      {
         argument.dataType = Structure::toDataType(value.toString());
         structure->setDirty();
      }
   }

   emit signalDataEdited();
   return result;
}

Patch::Structure::DataType Patch::Model::Argument::getDataType(const int index)
{
   const Structure::Argument& argument = structure->argumentList.at(index);

   return argument.dataType;
}
