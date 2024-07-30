#include "PatchWidget.h"

#include <QHBoxLayout>
#include <QScrollArea>

#include <QCoreApplication>
#include <QThread>

#include "DelegateType.h"
#include "DescriptionHighlighter.h"
#include "FileRef.h"
#include "MainWindow.h"
#include "Package/PackageInfo.h"
#include "PatchModelArgument.h"
#include "PatchModelNamedMessage.h"
#include "PatchModelOutput.h"
#include "PatchModelTypedMessage.h"

Patch::Widget::Widget(QWidget* parent)
   : QWidget(parent)
   , Structure()
   , path()
   , name()
   , modelList()
   , digest(nullptr)
{
   // left: scroll area
   QWidget* content = new QWidget();
   Ui::PatchWidget::setupUi(content);

   connect(patchDescriptionEditButton, &QAbstractButton::clicked, this, &Widget::slotSetPatchDigest);

   QScrollArea* scrollArea = new QScrollArea(this);
   scrollArea->setFrameShadow(QFrame::Plain);
   scrollArea->setFrameShape(QFrame::NoFrame);
   scrollArea->setWidgetResizable(true);
   scrollArea->setWidget(content);

   // set models

   Model::Argument* argumentModel = new Model::Argument(this, this);
   modelList.append(argumentModel);
   argumentTree->init(this, argumentModel, "Argument");
   argumentTree->setItemDelegateForColumn(1, new Delegate::Type(this, argumentModel));

   Model::TypedMessage* typedMessageModel = new Model::TypedMessage(this, this);
   modelList.append(typedMessageModel);
   typedMessageTree->init(this, typedMessageModel, "Typed Message");

   Model::NamedMessage* namedMessageModel = new Model::NamedMessage(this, this);
   modelList.append(namedMessageModel);
   namedMessageTree->init(this, namedMessageModel, "Named Message");

   Model::Output* outputModel = new Model::Output(this, this);
   modelList.append(outputModel);
   outputTree->init(this, outputModel, "Output");

   // right: digest area
   QWidget* editArea = new QWidget(this);
   Ui::DigestWidget::setupUi(editArea);

   new DescriptionHighlighter(descriptionEdit->document());

   connect(digestEdit, &QLineEdit::editingFinished, this, &Widget::slotSaveDigestText);
   connect(descriptionEdit, &QTextEdit::textChanged, this, &Widget::slotSaveDigestDescription);

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
   propagateDirty(false);

   File::Ref::read(this, name);

   rebuild();
}

void Patch::Widget::writeRef()
{
   File::Ref::write(this, name);
   propagateDirty(false);
}

bool Patch::Widget::isDirty() const
{
   return dirty;
}

void Patch::Widget::slotSetPatchDigest()
{
   setDigest(&patch.digest, "Patch");
}

void Patch::Widget::slotSaveDigestText()
{
   digest->text = digestEdit->text();
   setDirty();

   // update even if current digest does not belong to patch
   patchDigestEdit->setText(patch.digest.text);
}

void Patch::Widget::slotSaveDigestDescription()
{
   digest->description = descriptionEdit->toPlainText();
   setDirty();
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

   descriptionEdit->blockSignals(true);
   descriptionEdit->setText(digest->description);
   descriptionEdit->blockSignals(false);
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

void Patch::Widget::setDirty()
{
   propagateDirty(true);
}

void Patch::Widget::propagateDirty(bool isDirty)
{
   if (isDirty)
   {
      dirty = true;
      setWindowTitle(name + "*");
   }
   else
   {
      dirty = false;
      setWindowTitle(name);
   }

   for (QWidget* p = parentWidget(); p != nullptr; p = p->parentWidget())
   {
      MainWindow* mainWindow = qobject_cast<MainWindow*>(p);
      if (mainWindow)
      {
         mainWindow->checkDirty();
         return;
      }
   }
}
