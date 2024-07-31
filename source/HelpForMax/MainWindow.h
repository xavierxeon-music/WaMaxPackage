#ifndef MainWindowH
#define MainWindowH

#include <QMainWindow>

#include <QPointer>

#include "TestClient.h"

namespace Package
{
   class View;
}

namespace Patch
{
   class TabWidget;
}

namespace Schema
{
   class Widget;
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
   Schema::Widget* schemaWidget;
#ifdef TEST_CLIENT_AVAILABLE
   TestClient* testClient;
#endif // TEST_CLIENT_AVAILABLE
};

#endif // NOT MainWindowH
