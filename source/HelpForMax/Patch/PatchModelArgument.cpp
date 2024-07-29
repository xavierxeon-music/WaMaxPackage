#include "PatchModelArgument.h"

Patch::Model::Argument::Argument(QObject* parent, Block* block)
   : Abstract(parent, block)
   , Delegate::Type::Source()
{
}

void Patch::Model::Argument::update()
{
   Abstract::update();
}

void Patch::Model::Argument::rebuild()
{
   Abstract::rebuild();

   setHorizontalHeaderLabels({"Name", "Type", "Description"});

   for (const Structure::Argument& argument : block->argumentList)
   {
      QStandardItem* nameItem = new QStandardItem(argument.name);
      QStandardItem* typeItem = new QStandardItem(Structure::typeName(argument.type));
      QStandardItem* descrItem = new QStandardItem(argument.digest.text);
      descrItem->setEditable(false);

      invisibleRootItem()->appendRow({nameItem, typeItem, descrItem});
   }
}

Structure::Type Patch::Model::Argument::getType(const int index)
{
   const Structure::Argument& argument = block->argumentList.at(index);

   return argument.type;
}

bool Patch::Model::Argument::setData(const QModelIndex& index, const QVariant& value, int role)
{
   const bool result = QStandardItemModel::setData(index, value, role);
   if (Qt::EditRole == role)
   {
      Structure::Argument& argument = block->argumentList[index.row()];

      switch (index.column())
      {
         case 0:
            argument.name = value.toString();
            block->setDirty();
            break;
         case 1:
            argument.type = Structure::toType(value.toString());
            block->setDirty();
            break;
         default:
            break;
      }
   }

   return result;
}
