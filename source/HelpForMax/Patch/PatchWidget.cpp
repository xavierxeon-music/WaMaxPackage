#include "PatchWidget.h"

#include <QDesktopServices>
#include <QHBoxLayout>
#include <QScrollArea>

#include "DelegateType.h"
#include "DescriptionHighlighter.h"
#include "FileHelp.h"
#include "FileInit.h"
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

   setIcon(patchIcon, Structure::PatchPart::Patch);
   setIcon(argumentIcon, Structure::PatchPart::Argument);
   setIcon(typedMessageIcon, Structure::PatchPart::MessageTyped);
   setIcon(nameMessageIcon, Structure::PatchPart::MessageNamed);
   setIcon(outputIcon, Structure::PatchPart::Output);

   patchTypeCombo->addItem("Standard", QVariant::fromValue(Structure::PatchType::Standard));
   patchTypeCombo->addItem("Gui", QVariant::fromValue(Structure::PatchType::Gui));
   patchTypeCombo->addItem("Poly", QVariant::fromValue(Structure::PatchType::Poly));
   patchTypeCombo->addItem("Fourier", QVariant::fromValue(Structure::PatchType::Fourier));
   connect(patchTypeCombo, &QComboBox::currentIndexChanged, this, &Widget::slotPatchTypeChanged);

   // set models

   Model::Argument* argumentModel = new Model::Argument(this, this);
   modelList.append(argumentModel);
   argumentTree->init(this, argumentModel);
   argumentTree->setItemDelegateForColumn(1, new Delegate::Type(this, argumentModel));

   Model::TypedMessage* typedMessageModel = new Model::TypedMessage(this, this);
   modelList.append(typedMessageModel);
   typedMessageTree->init(this, typedMessageModel);

   Model::NamedMessage* namedMessageModel = new Model::NamedMessage(this, this);
   modelList.append(namedMessageModel);
   namedMessageTree->init(this, namedMessageModel);

   Model::Output* outputModel = new Model::Output(this, this);
   modelList.append(outputModel);
   outputTree->init(this, outputModel);

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

   File::Ref(this).read(name);

   rebuild();
}

void Patch::Widget::writeRef()
{
   File::Ref(this).write(name);
   File::Help(this).write(name);
   File::Init(this).write(name);
   propagateDirty(false);
}

void Patch::Widget::openInMax()
{
   QDesktopServices::openUrl(QUrl::fromLocalFile(path));
}

void Patch::Widget::openXML()
{
   const QString refPath = File::Ref(this).getFilePath(name);
   QDesktopServices::openUrl(QUrl::fromLocalFile(refPath));
}

bool Patch::Widget::isDirty() const
{
   return dirty;
}

void Patch::Widget::slotPatchTypeChanged(int index)
{
   patch.patcherType = patchTypeCombo->itemData(index).value<Structure::PatchType>();
   setDirty();
}

void Patch::Widget::slotSetPatchDigest()
{
   setDigest(&patch.digest, Structure::PatchPart::Patch);
   setDirty();

   // update even if current digest does not belong to patch
   update();
}

void Patch::Widget::slotSaveDigestText()
{
   digest->text = digestEdit->text();
   setDirty();

   // update even if current digest does not belong to patch
   update();
}

void Patch::Widget::slotSaveDigestDescription()
{
   digest->description = descriptionEdit->toPlainText();
   setDirty();
}

void Patch::Widget::setDigest(Digest* newDigest, const PatchPart& part)
{
   digest = newDigest;
   if (!digest)
   {
      topicInfo->clear();
      digestEdit->clear();
      descriptionEdit->clear();
      return;
   }

   setIcon(topicIcon, part);

   topicInfo->setText(partName(part));
   digestEdit->setText(digest->text);

   descriptionEdit->blockSignals(true);
   descriptionEdit->setText(digest->description);
   descriptionEdit->blockSignals(false);
}

void Patch::Widget::rebuild()
{
   for (Model::Abstract* model : modelList)
      model->rebuild();

   setDigest(&patch.digest, Structure::PatchPart::Patch);

   patchNameLabel->setText(name);
   patchDigestEdit->setText(patch.digest.text);

   const int typeIndex = patchTypeCombo->findData(QVariant::fromValue(patch.patcherType));
   patchTypeCombo->blockSignals(true);
   patchTypeCombo->setCurrentIndex(typeIndex);
   patchTypeCombo->blockSignals(false);
}

void Patch::Widget::update()
{
   for (Model::Abstract* model : modelList)
      model->update();

   patchDigestEdit->setText(patch.digest.text);
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

void Patch::Widget::setIcon(QLabel* iconLabel, Structure::PatchPart part)
{
   iconLabel->setPixmap(partIcon(part).pixmap(16, 16));
}
