#include "PackageWidget.h"

#include <QFileDialog>
#include <QFileInfo>
#include <QSettings>

#include "PackageModel.h"

Package::Widget::Widget(QWidget* parent)
   : QWidget(parent)
   , Info()
   , model(nullptr)
{
   setupUi(this);
   packageNameInfo->setText("<b>...</b>");

   model = new Model(this);
   packageTree->setModel(model);

   connect(packageTree, &QTreeView::doubleClicked, this, &Widget::slotItemDoubleClicked);

   QSettings settings;
   const QString packagePath = settings.value("Package/Path").toString();
   if (!packagePath.isEmpty())
   {
      Info::update(packagePath + "/");
   }
}

void Package::Widget::slotLoadPackage()
{
   const QString packageFileName = QFileDialog::getOpenFileName(this, "MAX PACKAGE", Package::Info::getPath(), "package-info.json");
   if (packageFileName.isEmpty())
      return;

   setPackage(packageFileName);
}

void Package::Widget::slotClosePackage()
{
   clear();
   emit signalCloseAllPatches();
}

void Package::Widget::slotItemDoubleClicked(const QModelIndex& index)
{
   QStandardItem* item = model->itemFromIndex(index);
   const QString path = item->data().toString();
   if (path.isEmpty())
      return;

   emit signalPatchSeleted(path);
}

void Package::Widget::clear()
{
   {
      QSettings settings;
      settings.setValue("Package/Path", "");
   }

   packageNameInfo->setText("<b>...</b>");

   model->clear();
   Info::clear();
}

void Package::Widget::create(const QString& packagePath)
{
   {
      QSettings settings;
      settings.setValue("Package/Path", packagePath);
   }

   model->create(packagePath);

   packageNameInfo->setText("<b>" + name + "</b>");
}
