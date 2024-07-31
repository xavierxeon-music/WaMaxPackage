#include "PatchTreeView.h"

#include <QTimer>

#include "PatchModelAbstract.h"
#include "PatchWidget.h"

Patch::TreeView::TreeView(QWidget* parent)
   : QTreeView(parent)
   , widget(nullptr)
   , model(nullptr)
   , forceRowHeight(-1)
{
   setRootIsDecorated(false);
   setUniformRowHeights(true);

   connect(this, &QAbstractItemView::clicked, this, &TreeView::slotItemClicked);
}

void Patch::TreeView::init(Widget* widget, Model::Abstract* model, int forceRowHeight)
{
   this->widget = widget;
   this->model = model;
   this->forceRowHeight = forceRowHeight;

   setModel(model);

   connect(model, &Model::Abstract::modelReset, this, &TreeView::slotResizeColumns);
}

void Patch::TreeView::setButtons(QToolButton* addButton, QToolButton* removeButton)
{
   static const QString styleSheet = "QToolButton { border: 0px none #8f8f91;}";

   static const QString plus = QString::fromUtf8("\u2795");
   addButton->setStyleSheet(styleSheet);
   addButton->setText(plus);
   connect(addButton, &QAbstractButton::clicked, this, &TreeView::slotAddElement);

   static const QString minus = QString::fromUtf8("\u2796");
   removeButton->setStyleSheet(styleSheet);
   removeButton->setText(minus);
   connect(removeButton, &QAbstractButton::clicked, this, &TreeView::slotRemoveElement);
}

void Patch::TreeView::slotResizeColumns()
{
   auto resizeIternal = [this]()
   {
      for (int col = 0; col < model->columnCount(); col++)
         this->resizeColumnToContents(col);

      if (this->forceRowHeight < 1)
         return;

      QModelIndex index = this->model->index(0, 0);
      const int height = this->header()->height() + this->rowHeight(index);

      this->setMaximumHeight(height + 10);
   };

   QTimer::singleShot(10, this, resizeIternal);
}

void Patch::TreeView::slotItemClicked(const QModelIndex& index)
{
   Structure::Digest* digest = model->getDigest(index);
   widget->setDigest(digest, model->getPart());
}

void Patch::TreeView::slotAddElement()
{
   QModelIndex index = selectedIndexes().isEmpty() ? QModelIndex() : selectedIndexes().first();
   model->createBeforeItem(index);
   model->rebuild();
}

void Patch::TreeView::slotRemoveElement()
{
   QModelIndex index = selectedIndexes().isEmpty() ? QModelIndex() : selectedIndexes().first();
   if (!index.isValid())
      return;

   model->removeItem(index);
   model->rebuild();
}
