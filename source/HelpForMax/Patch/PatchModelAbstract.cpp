#include "PatchModelAbstract.h"

Patch::Model::Abstract::Abstract(QObject* parent, Block* block)
   : QStandardItemModel(parent)
   , block(block)
{
}
