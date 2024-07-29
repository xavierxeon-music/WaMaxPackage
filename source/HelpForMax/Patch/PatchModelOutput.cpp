#include "PatchModelOutput.h"

Patch::Model::Output::Output(QObject* parent, Block* block)
   : Abstract(parent, block)
{
}

void Patch::Model::Output::update()
{
   Abstract::update();
}

void Patch::Model::Output::rebuild()
{
   Abstract::rebuild();
}
