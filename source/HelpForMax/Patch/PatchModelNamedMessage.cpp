#include "PatchModelNamedMessage.h"

Patch::Model::NamedMessage::NamedMessage(QObject* parent, Block* block)
   : Abstract(parent, block)
{
}

void Patch::Model::NamedMessage::update()
{
   Abstract::update();
}

void Patch::Model::NamedMessage::rebuild()
{
   Abstract::rebuild();
}
