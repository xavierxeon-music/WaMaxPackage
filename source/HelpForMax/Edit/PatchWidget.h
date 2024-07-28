#ifndef PatchWidgetH
#define PatchWidgetH

#include "Data/Block.h"
#include <QWidget>

#include <QJsonObject>
#include <QLocalSocket>
#include <QPointer>

#include "EditWidget.h"
#include "OverviewGraph.h"

namespace Component
{
   class Model;
};

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

   Component::Model* componentModel;
   EditWidget* editWidget;
   Overview::Graph* overviewWidget;
};

#endif // NOT PatchWidgetH
