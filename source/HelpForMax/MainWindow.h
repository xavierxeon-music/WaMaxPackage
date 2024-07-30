#ifndef MainWindowH
#define MainWindowH

#include <QMainWindow>

#include <QPointer>

#include "TestClient.h"

namespace Overview
{
   class Graph;
}

namespace Package
{
   class View;
}

namespace Patch
{
   class TabWidget;
}

class MainWindow : public QMainWindow
{
   Q_OBJECT

public:
   MainWindow();

public:
   void checkDirty();

private:
   void populateMenuAndToolBar();
   void closeEvent(QCloseEvent* ce) override;
   void toogleDock(QWidget* widget, const QString& name, bool enabled);

private:
   Patch::TabWidget* tabWidget;
   Package::View* packageView;
   Overview::Graph* overviewWidget;
   TestClient* testClient;
};

#endif // NOT MainWindowH
