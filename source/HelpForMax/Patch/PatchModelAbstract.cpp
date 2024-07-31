#include "PatchModelAbstract.h"

Patch::Model::Abstract::Abstract(QObject* parent, Structure* structure, const Structure::PatchPart& part)
   : QStandardItemModel(parent)
   , structure(structure)
   , part(part)
{
}

const Patch::Structure::PatchPart& Patch::Model::Abstract::getPart() const
{
   return part;
}
