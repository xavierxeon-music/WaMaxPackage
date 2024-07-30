#include "DelegateType.h"

#include <QComboBox>

Delegate::Type::Type(QObject* parent, Type::Source* source)
   : QStyledItemDelegate(parent)
   , source(source)
{
}

QWidget* Delegate::Type::createEditor(QWidget* parent, const QStyleOptionViewItem& option, const QModelIndex& index) const
{
   Q_UNUSED(option)
   Q_UNUSED(index)

   QComboBox* comboBox = new QComboBox(parent);
   comboBox->setFrame(false);
   for (const Structure::DataType& type : Structure::dataTypeList())
   {
      comboBox->addItem(Structure::dataTypeName(type));
   }

   for (int index = 0; index < comboBox->count(); index++)
   {
      comboBox->setItemData(index, Qt::AlignCenter, Qt::TextAlignmentRole);
   }

   return comboBox;
}

void Delegate::Type::setEditorData(QWidget* editor, const QModelIndex& index) const
{
   QComboBox* comboBox = qobject_cast<QComboBox*>(editor);

   const Structure::DataType type = source->getType(index.row());
   const int typeIndex = comboBox->findText(Structure::dataTypeName(type));
   comboBox->setCurrentIndex(typeIndex);
}

void Delegate::Type::setModelData(QWidget* editor, QAbstractItemModel* model, const QModelIndex& index) const
{
   QComboBox* comboBox = qobject_cast<QComboBox*>(editor);

   const QString typeText = comboBox->currentText();
   model->setData(index, typeText, Qt::EditRole);
}

void Delegate::Type::updateEditorGeometry(QWidget* editor, const QStyleOptionViewItem& option, const QModelIndex& index) const
{
   Q_UNUSED(index)

   editor->setGeometry(option.rect);
}
