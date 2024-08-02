#include "PackageWidget.h"

#include <QFileInfo>
#include <QSettings>

#include "PackageModel.h"

Package::Widget::Widget(QWidget* parent)
   : QWidget(parent)
   , Info()
   , model(nullptr)
{
   setupUi(this);

   model = new Model(this);
   packageTree->setModel(model);

   connect(packageTree, &QTreeView::doubleClicked, this, &Widget::slotItemDoubleClicked);

   QSettings settings;
   const QString packagePath = settings.value("Package/Path").toString();
   if (!packagePath.isEmpty())
   {
      QFileInfo packageInfo(packagePath + "/");
      Info::update(packageInfo);
   }
}

void Package::Widget::slotItemDoubleClicked(const QModelIndex& index)
{
   QStandardItem* item = model->itemFromIndex(index);
   const QString path = item->data().toString();
   if (path.isEmpty())
      return;

   emit signalPatchSeleted(path);
}

void Package::Widget::clearContent()
{
   model->clear();
}

void Package::Widget::createContent(const QString& packagePath)
{
   {
      QSettings settings;
      settings.setValue("Package/Path", packagePath);
   }

   model->create(packagePath);
}
