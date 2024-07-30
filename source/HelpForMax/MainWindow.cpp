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
#include "Package/PackageView.h"
#include "Patch/PatchTabWidget.h"
#include "Patch/PatchWidget.h"

MainWindow::MainWindow()
   : QMainWindow(nullptr)
   , tabWidget(nullptr)
   , packageView(nullptr)
   , overviewWidget(nullptr)
   , testClient(nullptr)
{
   setWindowTitle("Help For Max [*]");

   tabWidget = new Patch::TabWidget(this);
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

   packageView = new Package::View(this);
   addDock(packageView, Qt::LeftDockWidgetArea, "Package");

   overviewWidget = new Overview::Graph(this);
   addDock(overviewWidget, Qt::RightDockWidgetArea, "OverView");

   connect(tabWidget, &Patch::TabWidget::signalTabSelected, overviewWidget, &Overview::Graph::slotLoad);

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
   QAction* openPatchAction = patchMenu->addAction(QIcon(":/PatchLoad.svg"), "Load", tabWidget, &Patch::TabWidget::slotOpenPatch);
   patchMenu->addMenu(tabWidget->getRecentMenu());
   QAction* saveRefAction = patchMenu->addAction(QIcon(":/PatchSave.svg"), "Save", tabWidget, &Patch::TabWidget::slotWriteRef);
   patchMenu->addAction(QIcon(":/PatchSaveAll.svg"), "SaveAll");
   patchMenu->addSeparator();
   QAction* closePatchAction = patchMenu->addAction(QIcon(":/PatchClose.svg"), "Close", tabWidget, &Patch::TabWidget::slotClosePatch);
   patchMenu->addSeparator();
   patchMenu->addAction(QIcon(":/PatchOpenInMax.svg"), "Open In Max");
   patchMenu->addAction(QIcon(":/PatchOpenRef.svg"), "Open XML");

   //
   QMenu* viewMenu = menuBar()->addMenu("View");
   auto addViewToggle = [&](QWidget* widget, const QString& text, const QIcon& icon = QIcon())
   {
      auto toggleFunction = std::bind(&MainWindow::toogleDock, this, widget, text, std::placeholders::_1);
      QAction* viewAction = viewMenu->addAction(text, toggleFunction);
      viewAction->setCheckable(true);

      if (!icon.isNull())
         viewAction->setIcon(icon);

      QSettings dockSettings;
      const bool enabled = dockSettings.value("Dock/" + text).toBool();

      widget->setVisible(enabled);
      viewAction->setChecked(enabled);

      return viewAction;
   };

   QAction* packageAction = addViewToggle(packageView, "Package", QIcon(":/PackageGeneral.svg"));
   QAction* overviewAction = addViewToggle(overviewWidget, "Overview", QIcon(":/OverviewGeneral.svg"));
   addViewToggle(testClient, "Test");
   viewMenu->addSeparator();

   //
   auto spacer = [&]()
   {
      QWidget* widget = new QWidget(this);
      widget->setSizePolicy(QSizePolicy::MinimumExpanding, QSizePolicy::Preferred);

      return widget;
   };

   QToolBar* patchToolBar = addToolBar("Patch");
   patchToolBar->setObjectName("Patch");
   patchToolBar->setMovable(false);

   patchToolBar->addAction(openPatchAction);
   patchToolBar->addAction(saveRefAction);
   patchToolBar->addSeparator();
   patchToolBar->addAction(closePatchAction);

   QToolBar* viewToolBar = addToolBar("View");
   viewToolBar->setObjectName("View");
   viewToolBar->setMovable(false);

   viewToolBar->addWidget(spacer());
   viewToolBar->addAction(packageAction);
   viewToolBar->addAction(overviewAction);
}

void MainWindow::checkDirty()
{
   bool dirty = false;
   for (Patch::Widget* widget : findChildren<Patch::Widget*>())
   {
      dirty |= widget->isDirty();
   }

   setWindowModified(dirty);
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

   QSettings::setDefaultFormat(QSettings::IniFormat);

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
