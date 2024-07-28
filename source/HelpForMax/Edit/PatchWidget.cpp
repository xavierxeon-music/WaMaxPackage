#include "PatchWidget.h"

#include <QHBoxLayout>

#include "ComponentModel.h"
#include "Data/Package.h"

PatchWidget::PatchWidget(QWidget* parent)
   : QWidget(parent)
   , Block()
   , patchName()
   , componentModel(nullptr)
   , editWidget(nullptr)
   , overviewWidget(nullptr)
{
   componentModel = new Component::Model(this, this);

   editWidget = new EditWidget(this, componentModel);
   overviewWidget = new Overview::Graph(this);

   QHBoxLayout* masterLayout = new QHBoxLayout(this);
   masterLayout->setContentsMargins(0, 0, 0, 0);
   masterLayout->addWidget(editWidget);
   masterLayout->addWidget(overviewWidget);
}

void PatchWidget::openPatch(const QString& patchPath)
{
   patchName = Package::setPatchPath(patchPath);
   setWindowTitle(patchName);

   read(patchName);
   overviewWidget->load(patchPath);

   componentModel->patchSelected();
}

void PatchWidget::writeRef()
{
}
