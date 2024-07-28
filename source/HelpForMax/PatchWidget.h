#ifndef PatchWidgetH
#define PatchWidgetH

#include "Block/Block.h"
#include <QWidget>

#include <QJsonObject>
#include <QLocalSocket>
#include <QPointer>

#include "Edit/EditWidget.h"

class PatchWidget : public QWidget, private Block
{
   Q_OBJECT

public:
   PatchWidget(QWidget* parent);

public:
   void openPatch(const QString& pathPath);
   virtual void writeRef();

private:
   QString patchName;

   EditWidget* editWidget;
   QWidget* overviewWidget;
};

#endif // NOT PatchWidgetH
