#include "PatchModelAbstract.h"

Patch::Model::Abstract::Abstract(QObject* parent, Block* block)
   : QStandardItemModel(parent)
   , block(block)
{
}

void Patch::Model::Abstract::update()
{
}

void Patch::Model::Abstract::rebuild()
{
   clear();
}
