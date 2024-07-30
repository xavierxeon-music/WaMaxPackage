#include "PatchModelArgument.h"

Patch::Model::Argument::Argument(QObject* parent, Structure* structure)
   : Abstract(parent, structure)
   , Delegate::Type::Source()
{
}

void Patch::Model::Argument::update()
{
}

void Patch::Model::Argument::rebuild()
{
   beginResetModel();

   clear();

   setHorizontalHeaderLabels({"Name", "Type", "Description"});

   for (const Structure::Argument& argument : structure->argumentList)
   {
      QStandardItem* nameItem = new QStandardItem(argument.name);

      QStandardItem* typeItem = new QStandardItem(Structure::typeName(argument.type));

      QStandardItem* descrItem = new QStandardItem(argument.digest.text);
      descrItem->setEditable(false);

      invisibleRootItem()->appendRow({nameItem, typeItem, descrItem});
   }

   endResetModel();
}

Structure::Digest* Patch::Model::Argument::getDigest(const QModelIndex& index)
{
   Structure::Argument& argument = structure->argumentList[index.row()];
   return &(argument.digest);
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
            argument.type = Structure::toType(value.toString());
            structure->setDirty();
            break;
         default:
            break;
      }
   }

   return result;
}

Structure::Type Patch::Model::Argument::getType(const int index)
{
   const Structure::Argument& argument = structure->argumentList.at(index);

   return argument.type;
}
