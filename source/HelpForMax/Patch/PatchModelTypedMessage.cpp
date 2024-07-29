#include "PatchModelTypedMessage.h"

Patch::Model::TypedMessage::TypedMessage(QObject* parent, Block* block)
   : Abstract(parent, block)
{
}

void Patch::Model::TypedMessage::update()
{
   Abstract::update();
}

void Patch::Model::TypedMessage::rebuild()
{
   Abstract::rebuild();
}
