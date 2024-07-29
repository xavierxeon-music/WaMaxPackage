#include "PatchModelAbstract.h"

Patch::Model::Abstract::Abstract(QObject* parent, Block* block)
   : QStandardItemModel(parent)
   , TypeDelegate::Proxy()
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

Structure::Type Patch::Model::Abstract::getType(const int index)
{
   Q_UNUSED(index);

   return Structure::Type::Anything;
}
