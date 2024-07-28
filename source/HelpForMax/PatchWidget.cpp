#include "PatchWidget.h"

#include <QHBoxLayout>

#include "Block/Package.h"

PatchWidget::PatchWidget(QWidget* parent)
   : QWidget(parent)
   , Block()
   , patchName()
   , editWidget(nullptr)
   , overviewWidget(nullptr)
{
   editWidget = new EditWidget(this);
   overviewWidget = new QWidget(this);

   QHBoxLayout* masterLayout = new QHBoxLayout(this);
   masterLayout->addWidget(editWidget);
   masterLayout->addWidget(overviewWidget);
}

void PatchWidget::openPatch(const QString& pathPath)
{
   patchName = Package::setPatchPath(pathPath);
   setWindowTitle(patchName);

   read(patchName);
   qDebug() << Package::getPath() << patchName;
}

void PatchWidget::writeRef()
{
}
