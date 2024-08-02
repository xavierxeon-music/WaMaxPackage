#ifndef MainWindowH
#define MainWindowH

#include <QMainWindow>

#include "Package/PackageWidget.h"
#include "Patch/PatchTabWidget.h"
#include "SchemaWidget.h"
#include "TestClient.h"

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
   Package::Widget* packageWidget;
   Schema::Widget* schemaWidget;
#ifdef TEST_CLIENT_AVAILABLE
   TestClient* testClient;
#endif // TEST_CLIENT_AVAILABLE
};

#endif // NOT MainWindowH
