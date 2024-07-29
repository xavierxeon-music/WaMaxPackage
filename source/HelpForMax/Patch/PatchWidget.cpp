#include "PatchWidget.h"

#include <QHBoxLayout>

#include "ComponentModel.h"
#include "Package/PackageInfo.h"

Patch::Widget::Widget(QWidget* parent)
   : QWidget(parent)
   , Block()
   , path()
   , name()
   , componentModel(nullptr)
{
   setupUi(this);

   componentModel = new Component::Model(this, this);
   componentTree->setModel(componentModel);
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
   //overviewWidget->load(patchPath);

   componentModel->patchSelected();
}

void Patch::Widget::writeRef()
{
}
