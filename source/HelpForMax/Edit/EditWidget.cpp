#include "EditWidget.h"

#include "ComponentModel.h"

EditWidget::EditWidget(QWidget* parent, Component::Model* model)
   : QWidget(parent)
{
   setupUi(this);

   componentTree->setModel(model);
}
