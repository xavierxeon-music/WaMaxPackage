#include "FileAbstract.h"

File::Abstract::Abstract(Structure* structure)
   : structure(structure)
{
}

void File::Abstract::read(const QString& patchName)
{
   Q_UNUSED(patchName)
}
