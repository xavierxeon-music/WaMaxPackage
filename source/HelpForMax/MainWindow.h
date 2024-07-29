#ifndef MainWindowH
#define MainWindowH

#include <QMainWindow>

#include <QPointer>

#include "TestClient.h"

class TabWidget;

namespace Overview
{
   class Graph;
}

class MainWindow : public QMainWindow
{
   Q_OBJECT

public:
   MainWindow();

private:
   void populateMenuAndToolBar();
   void setModified(bool enabled, QString key);
   void closeEvent(QCloseEvent* ce) override;
   void toogleDock(QWidget* widget, const QString& name, bool enabled);

private:
   TabWidget* tabWidget;
   Overview::Graph* overviewWidget;
   TestClient* testClient;
};

#endif // NOT MainWindowH
