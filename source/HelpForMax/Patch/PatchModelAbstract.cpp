#include "PatchModelAbstract.h"

Patch::Model::Abstract::Abstract(QObject* parent, Structure* structure)
   : QStandardItemModel(parent)
   , structure(structure)
{
}
