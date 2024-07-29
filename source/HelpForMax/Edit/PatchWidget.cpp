#include "PatchWidget.h"

#include <QHBoxLayout>

#include "ComponentModel.h"
#include "Data/Package.h"

Patch::Widget::Widget(QWidget* parent)
   : QWidget(parent)
   , Block()
   , patchName()
   , componentModel(nullptr)
{
   setupUi(this);

   componentModel = new Component::Model(this, this);
   componentTree->setModel(componentModel);
}

void Patch::Widget::openPatch(const QString& patchPath)
{
   patchName = Package::setPatchPath(patchPath);
   setWindowTitle(patchName);

   read(patchName);
   //overviewWidget->load(patchPath);

   componentModel->patchSelected();
}

void Patch::Widget::writeRef()
{
}
