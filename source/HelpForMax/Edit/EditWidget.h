#ifndef EditWidgetH
#define EditWidgetH

#include "ui_EditWidget.h"
#include <QWidget>

namespace Component
{
   class Model;
};

class EditWidget : public QWidget, private Ui::EditWidget
{
   Q_OBJECT

public:
   EditWidget(QWidget* parent, Component::Model* model);
};

#endif // NOT EditWidgetH
