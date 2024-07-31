#include "PatchModelOutput.h"

Patch::Model::Output::Output(QObject* parent, Structure* structure)
   : Abstract(parent, structure, Structure::PatchPart::Output)
{
}

void Patch::Model::Output::update()
{
}

void Patch::Model::Output::rebuild()
{
}

Patch::Structure::Digest* Patch::Model::Output::getDigest(const QModelIndex& index)
{
   Q_UNUSED(index)

   return nullptr;
}
