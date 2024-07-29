#include "PatchWidget.h"

#include <QHBoxLayout>
#include <QScrollArea>

#include <QCoreApplication>
#include <QThread>

#include "ComponentModel.h"
#include "Package/PackageInfo.h"

Patch::Widget::Widget(QWidget* parent)
   : QWidget(parent)
   , Block()
   , path()
   , name()
{
   // left: scroll area
   QWidget* content = new QWidget();
   Ui::PatchWidget::setupUi(content);

   QScrollArea* scrollArea = new QScrollArea(this);
   scrollArea->setFrameShadow(QFrame::Plain);
   scrollArea->setFrameShape(QFrame::NoFrame);
   scrollArea->setWidget(content);

   // right: digest area
   QWidget* editArea = new QWidget(this);
   Ui::DigetWidget::setupUi(editArea);

   QHBoxLayout* masterLayout = new QHBoxLayout(this);
   masterLayout->setContentsMargins(0, 0, 0, 0);
   masterLayout->addWidget(scrollArea);
   masterLayout->addWidget(editArea);
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
