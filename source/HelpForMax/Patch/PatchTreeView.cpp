#include "PatchTreeView.h"

#include <QTimer>

#include "PatchModelAbstract.h"
#include "PatchWidget.h"

Patch::TreeView::TreeView(QWidget* parent)
   : QTreeView(parent)
   , widget(nullptr)
   , model(nullptr)
   , id("???")
{
   setRootIsDecorated(false);
   connect(this, &QAbstractItemView::clicked, this, &TreeView::slotItemClicked);
}

void Patch::TreeView::init(Widget* widget, Model::Abstract* model, const QString& id)
{
   this->widget = widget;
   this->model = model;
   this->id = id;
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

void Patch::TreeView::slotItemClicked(const QModelIndex& index)
{
   Structure::Digest* digest = model->getDigest(index);
   widget->setDigest(digest, id);
}
