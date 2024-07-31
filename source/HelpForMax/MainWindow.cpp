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
#include "Package/PackageView.h"
#include "Patch/PatchTabWidget.h"
#include "Patch/PatchWidget.h"
#include "SchemaWidget.h"

MainWindow::MainWindow()
   : QMainWindow(nullptr)
   , tabWidget(nullptr)
   , packageView(nullptr)
   , schemaWidget(nullptr)
#ifdef TEST_CLIENT_AVAILABLE
   , testClient(nullptr)
#endif // TEST_CLIENT_AVAILABLE
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

   schemaWidget = new Schema::Widget(this);
   addDock(schemaWidget, Qt::RightDockWidgetArea, "Schema");

   connect(tabWidget, &Patch::TabWidget::signalTabSelected, schemaWidget, &Schema::Widget::slotLoad);

#ifdef TEST_CLIENT_AVAILABLE
   testClient = new TestClient;
   addDock(testClient, Qt::TopDockWidgetArea, "Test");
#endif // TEST_CLIENT_AVAILABLE

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

   QAction* lopdPatchAction = patchMenu->addAction(QIcon(":/PatchLoad.svg"), "Load", tabWidget, &Patch::TabWidget::slotLoadPatch);
   patchMenu->addMenu(tabWidget->getRecentMenu());

   QAction* saveRefAction = patchMenu->addAction(QIcon(":/PatchSave.svg"), "Save", tabWidget, &Patch::TabWidget::slotWriteRef);
   saveRefAction->setShortcut(QKeySequence::Save);

   patchMenu->addAction(QIcon(":/PatchSaveAll.svg"), "SaveAll", tabWidget, &Patch::TabWidget::slotWriteAllRefs);
   patchMenu->addSeparator();

   QAction* closePatchAction = patchMenu->addAction(QIcon(":/PatchClose.svg"), "Close", tabWidget, &Patch::TabWidget::slotClosePatch);
   closePatchAction->setShortcut(QKeySequence::Close);
   patchMenu->addSeparator();

   //
   QMenu* viewMenu = menuBar()->addMenu("View");
   auto addViewToggle = [&](QWidget* widget, const QString& name, const QIcon& icon = QIcon())
   {
      auto toggleFunction = std::bind(&MainWindow::toogleDock, this, widget, name, std::placeholders::_1);
      QAction* viewAction = viewMenu->addAction(name, toggleFunction);
      viewAction->setCheckable(true);

      if (!icon.isNull())
         viewAction->setIcon(icon);

      QSettings dockSettings;
      const bool enabled = dockSettings.value("DockEnabled/" + name).toBool();

      widget->setVisible(enabled);
      viewAction->setChecked(enabled);

      const QSize size = dockSettings.value("DockSize/" + name).toSize();
      if (enabled && !size.isNull())
         widget->setMinimumSize(size);

      return viewAction;
   };

   QAction* packageAction = addViewToggle(packageView, "Package", QIcon(":/PackageGeneral.svg"));
   QAction* schemmaAction = addViewToggle(schemaWidget, "Schema", QIcon(":/OverviewGeneral.svg"));
   schemmaAction->setShortcut(QKeySequence::Print);

#ifdef TEST_CLIENT_AVAILABLE
   addViewToggle(testClient, "TestClient");
#endif // TEST_CLIENT_AVAILABLE

   viewMenu->addSeparator();
   viewMenu->addAction(QIcon(":/PatchOpenInMax.svg"), "Open In Max", tabWidget, &Patch::TabWidget::slotOpenInMax);

   QAction* showXMLAction = viewMenu->addAction(QIcon(":/PatchOpenRef.svg"), "Open XML", tabWidget, &Patch::TabWidget::slotOpenXML);
   showXMLAction->setShortcut(QKeySequence::Open);
   viewMenu->addSeparator();

   //
   auto spacer = [&]()
   {
      QWidget* widget = new QWidget(this);
      widget->setMinimumWidth(100);
      widget->setSizePolicy(QSizePolicy::MinimumExpanding, QSizePolicy::Preferred);

      return widget;
   };

   auto createToolBar = [&](const QString& name)
   {
      QToolBar* toolBar = addToolBar(name);
      toolBar->setObjectName(name);
      toolBar->setMovable(false);

      return toolBar;
   };

   QToolBar* patchToolBar = createToolBar("Patch");
   patchToolBar->addAction(lopdPatchAction);
   patchToolBar->addAction(saveRefAction);
   patchToolBar->addSeparator();
   patchToolBar->addAction(closePatchAction);

   QToolBar* viewToolBar = createToolBar("View");
   viewToolBar->addWidget(spacer());
   viewToolBar->addAction(packageAction);
   viewToolBar->addAction(schemmaAction);
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
   QSettings dockSettings;
   dockSettings.setValue("DockEnabled/" + name, enabled);
   if (!enabled)
   {
      dockSettings.setValue("DockSize/" + name, widget->size());
      widget->setVisible(false);
   }
   else
   {
      widget->setVisible(true);
      const QSize size = dockSettings.value("DockSize/" + name).toSize();
      if (!size.isNull())
         widget->setMinimumSize(size);
   }
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
