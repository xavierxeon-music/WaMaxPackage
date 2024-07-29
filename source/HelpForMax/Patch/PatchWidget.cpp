#include "PatchWidget.h"

#include <QHBoxLayout>

#include "ComponentModel.h"
#include "Package/PackageInfo.h"

Patch::Widget::Widget(QWidget* parent)
   : QWidget(parent)
   , Block()
   , path()
   , name()
{
   setupUi(this);
}

const QString& Patch::Widget::getPath() const
{
   return path;
}

void Patch::Widget::openPatch(const QString& patchPath)
{
   path = patchPath;

   name = Package::Info::setPatchPath(path);
   setWindowTitle(name);
   read(name);

   //componentModel->patchSelected();
}

void Patch::Widget::writeRef()
{
}
