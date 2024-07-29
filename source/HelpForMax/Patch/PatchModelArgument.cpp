#include "PatchModelArgument.h"

Patch::Model::Argument::Argument(QObject* parent, Block* block)
   : Abstract(parent, block)
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
