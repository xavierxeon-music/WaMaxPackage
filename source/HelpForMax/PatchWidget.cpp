#include "PatchWidget.h"

#include <QHBoxLayout>

#include "Data/Package.h"

PatchWidget::PatchWidget(QWidget* parent)
   : QWidget(parent)
   , Block()
   , patchName()
   , editWidget(nullptr)
   , overviewWidget(nullptr)
{
   editWidget = new EditWidget(this);
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
}

void PatchWidget::writeRef()
{
}
