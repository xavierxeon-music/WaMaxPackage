#include "PatchWidget.h"

#include <QHBoxLayout>

#include "ComponentModel.h"
#include "Package/PackageInfo.h"

Patch::Widget::Widget(QWidget* parent)
   : QScrollArea(parent)
   , Block()
   , path()
   , name()
{
   QWidget* content = new QWidget(this);
   setWidget(content);
   setupUi(content);
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
