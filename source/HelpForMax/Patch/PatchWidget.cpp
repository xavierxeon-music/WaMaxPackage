#include "PatchWidget.h"

#include <QHBoxLayout>
#include <QScrollArea>

#include <QCoreApplication>
#include <QThread>

#include "DelegateType.h"
#include "Package/PackageInfo.h"
#include "PatchModelArgument.h"
#include "PatchModelNamedMessage.h"
#include "PatchModelOutput.h"
#include "PatchModelTypedMessage.h"

Patch::Widget::Widget(QWidget* parent)
   : QWidget(parent)
   , Block()
   , path()
   , name()
   , modelList()
   , digest(nullptr)
{
   // left: scroll area
   QWidget* content = new QWidget();
   Ui::PatchWidget::setupUi(content);

   QScrollArea* scrollArea = new QScrollArea(this);
   scrollArea->setFrameShadow(QFrame::Plain);
   scrollArea->setFrameShape(QFrame::NoFrame);
   scrollArea->setVerticalScrollBarPolicy(Qt::ScrollBarAlwaysOn);
   scrollArea->setWidget(content);

   // right: digest area
   QWidget* editArea = new QWidget(this);
   Ui::DigetWidget::setupUi(editArea);

   Model::Argument* argumentModel = new Model::Argument(this, this);
   modelList.append(argumentModel);
   argumentTree->setModel(argumentModel);
   argumentTree->setItemDelegateForColumn(1, new Delegate::Type(this, argumentModel));

   Model::TypedMessage* typedMessageModel = new Model::TypedMessage(this, this);
   modelList.append(typedMessageModel);
   typedMessageTree->setModel(typedMessageModel);

   Model::NamedMessage* namedMessageModel = new Model::NamedMessage(this, this);
   modelList.append(namedMessageModel);
   namedMessageTree->setModel(namedMessageModel);

   Model::Output* outputModel = new Model::Output(this, this);
   modelList.append(outputModel);
   outputTree->setModel(outputModel);

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

   rebuild();
}

void Patch::Widget::writeRef()
{
   write(name);
}

void Patch::Widget::setDigest(Digest* newDigest, const QString& name)
{
   digest = newDigest;
   if (!digest)
   {
      topicInfo->clear();
      digestEdit->clear();
      descriptionEdit->clear();
      return;
   }

   topicInfo->setText(name);
   digestEdit->setText(digest->text);
   descriptionEdit->setText(digest->description);
}

void Patch::Widget::rebuild()
{
   for (Model::Abstract* model : modelList)
      model->rebuild();

   setDigest(&patch.digest, "Patch");

   patchNameLabel->setText(name);
   patchDigestEdit->setText(patch.digest.text);
}

void Patch::Widget::update()
{
}
