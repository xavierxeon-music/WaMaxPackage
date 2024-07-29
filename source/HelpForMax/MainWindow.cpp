#include "MainWindow.h"

#include <QApplication>
#include <QCloseEvent>
#include <QDockWidget>
#include <QMenu>
#include <QMenuBar>
#include <QMessageBox>
#include <QSettings>
#include <QToolBar>

#include "HelpForMax.h"
#include "MessageBar.h"
#include "OverviewGraph.h"
#include "TabWidget.h"

MainWindow::MainWindow()
   : QMainWindow(nullptr)
   , tabWidget(nullptr)
   , overviewWidget(nullptr)
   , testClient(nullptr)
{
   setWindowTitle("Help For Max");

   tabWidget = new TabWidget(this);
   setCentralWidget(tabWidget);

   setStatusBar(new MessageBar(this));

   auto addDock = [&](QWidget* widget, const Qt::DockWidgetArea& area, const QString& name)
   {
      QDockWidget* dockWidget = new QDockWidget(this);
      dockWidget->setObjectName(name);
      dockWidget->setWidget(widget);
      dockWidget->setFeatures(QDockWidget::NoDockWidgetFeatures);
      dockWidget->setTitleBarWidget(new QWidget());

      addDockWidget(area, dockWidget);
   };

   overviewWidget = new Overview::Graph(this);
   addDock(overviewWidget, Qt::RightDockWidgetArea, "OverView");

   testClient = new TestClient;
   addDock(testClient, Qt::TopDockWidgetArea, "Test");

   populateMenuAndToolBar();

   QSettings widgetSettings;
   qDebug() << "SETTINGS @" << widgetSettings.fileName();
   restoreGeometry(widgetSettings.value("MainWidget/Geometry").toByteArray());
   restoreState(widgetSettings.value("MainWidget/State").toByteArray());
}

void MainWindow::populateMenuAndToolBar()
{
   //
   QMenu* patchMenu = menuBar()->addMenu("Patch");
   QAction* openPatchAction = patchMenu->addAction(QIcon(":/OpenPatch.svg"), "Open", tabWidget, &TabWidget::slotOpenPatch);
   patchMenu->addMenu(tabWidget->getRecentMenu());
   QAction* saveRefAction = patchMenu->addAction(QIcon(":/SaveAllPatches.svg"), "Save", tabWidget, &TabWidget::slotWriteRef);
   patchMenu->addSeparator();
   QAction* closePatchAction = patchMenu->addAction(QIcon(":/Editor.svg"), "Close", tabWidget, &TabWidget::slotClosePatch);

   //
   QMenu* viewMenu = menuBar()->addMenu("View");
   auto addViewToggle = [&](QWidget* widget, const QString& text)
   {
      //QAction* viewAction = viewMenu->addAction(text, widget, &QWidget::setVisible);

      auto toggleFunction = std::bind(&MainWindow::toogleDock, this, widget, text, std::placeholders::_1);
      QAction* viewAction = viewMenu->addAction(text, toggleFunction);
      viewAction->setCheckable(true);

      QSettings dockSettings;
      const bool enabled = dockSettings.value("Dock/" + text).toBool();

      widget->setVisible(enabled);
      viewAction->setChecked(enabled);
   };
   addViewToggle(overviewWidget, "Overview");
   addViewToggle(testClient, "Test");
   viewMenu->addSeparator();

   //
   auto spacer = [&]()
   {
      QWidget* widget = new QWidget(this);
      widget->setSizePolicy(QSizePolicy::MinimumExpanding, QSizePolicy::Preferred);

      return widget;
   };
   Q_UNUSED(spacer)

   QToolBar* patchToolBar = addToolBar("Patch");
   patchToolBar->setObjectName("Patch");
   patchToolBar->setMovable(false);

   patchToolBar->addAction(openPatchAction);
   patchToolBar->addAction(saveRefAction);
   patchToolBar->addSeparator();
   patchToolBar->addAction(closePatchAction);
}

void MainWindow::setModified(bool enabled, QString key)
{
   Q_UNUSED(key)

   setWindowModified(enabled);
}

void MainWindow::closeEvent(QCloseEvent* ce)
{
   QSettings widgetSettings;
   widgetSettings.setValue("MainWidget/Geometry", saveGeometry());
   widgetSettings.setValue("MainWidget/State", saveState());

   ce->accept();
}

void MainWindow::toogleDock(QWidget* widget, const QString& name, bool enabled)
{
   widget->setVisible(enabled);

   QSettings dockSettings;
   dockSettings.setValue("Dock/" + name, enabled);
}

// main function

int main(int argc, char** argv)
{
   QApplication::setApplicationName("HelpForMax");
   QApplication::setOrganizationDomain("schweinesystem.ddns.org");
   QApplication::setOrganizationName("SchweineSystem");

   QApplication app(argc, argv);

   // only allow one instance
   if (HelpForMax::isServerActive())
   {
      QMessageBox::critical(nullptr, "HelpForMax", "Only one running instance allowed");
      return 1;
   }

   MainWindow mw;
   mw.show();

   return app.exec();
}
