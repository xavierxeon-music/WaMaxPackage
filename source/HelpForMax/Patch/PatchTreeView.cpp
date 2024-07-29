#include "PatchTreeView.h"

#include <QTimer>

#include "PatchModelAbstract.h"

Patch::TreeView::TreeView(QWidget* parent)
   : QTreeView(parent)
   , model(nullptr)
{
   setRootIsDecorated(false);
   connect(this, &QAbstractItemView::doubleClicked, this, &TreeView::slotItemDoubleClicked);
}

void Patch::TreeView::init(Model::Abstract* model)
{
   this->model = model;
   setModel(model);

   connect(model, &Model::Abstract::modelReset, this, &TreeView::slotResizeColumns);
}

void Patch::TreeView::slotResizeColumns()
{
   auto resizeIternal = [this]()
   {
      for (int col = 0; col < model->columnCount(); col++)
         this->resizeColumnToContents(col);
   };

   QTimer::singleShot(10, this, resizeIternal);
}

void Patch::TreeView::slotItemDoubleClicked(const QModelIndex& index)
{
   model->getDigest(index);
   qDebug() << index;
}
