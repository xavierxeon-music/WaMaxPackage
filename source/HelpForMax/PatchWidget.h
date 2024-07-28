#ifndef PatchWidgetH
#define PatchWidgetH

#include "Block/Block.h"
#include <QWidget>

#include <QJsonObject>
#include <QLocalSocket>
#include <QPointer>

#include "Edit/EditWidget.h"
#include "OverviewGraph.h"

class PatchWidget : public QWidget, private Block
{
   Q_OBJECT

public:
   PatchWidget(QWidget* parent);

public:
   void openPatch(const QString& patchPath);
   virtual void writeRef();

private:
   QString patchName;

   EditWidget* editWidget;
   Overview::Graph* overviewWidget;
};

#endif // NOT PatchWidgetH