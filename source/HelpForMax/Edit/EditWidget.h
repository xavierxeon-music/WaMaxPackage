#ifndef EditWidgetH
#define EditWidgetH

#include "ui_PatchWidget.h"
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
