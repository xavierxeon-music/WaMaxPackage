#include "PatchModelNamedMessage.h"

Patch::Model::NamedMessage::NamedMessage(QObject* parent, Block* block)
   : Abstract(parent, block)
{
}

void Patch::Model::NamedMessage::update()
{
}

void Patch::Model::NamedMessage::rebuild()
{
}

Structure::Digest* Patch::Model::NamedMessage::getDigest(const QModelIndex& index)
{
   const QString name = invisibleRootItem()->child(index.row(), 0)->text();

   Structure::Message& message = block->messageNamedMap[name];
   return &(message.digest);
}
