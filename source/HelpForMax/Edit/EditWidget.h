#ifndef EditWidgetH
#define EditWidgetH

#include "ui_EditWidget.h"
#include <QWidget>

class EditWidget : public QWidget, private Ui::EditWidget
{
   Q_OBJECT

public:
   EditWidget(QWidget* parent);
};

#endif // NOT EditWidgetH
