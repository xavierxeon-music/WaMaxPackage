#include "PatchModelOutput.h"

Patch::Model::Output::Output(QObject* parent, Block* block)
   : Abstract(parent, block)
{
}

void Patch::Model::Output::update()
{
}

void Patch::Model::Output::rebuild()
{
}

Structure::Digest* Patch::Model::Output::getDigest(const QModelIndex& index)
{
   Q_UNUSED(index)

   return nullptr;
}
