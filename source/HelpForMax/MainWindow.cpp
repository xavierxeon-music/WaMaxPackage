#include "MainWindow.h"

#include <QApplication>
#include <QCloseEvent>
#include <QMenu>
#include <QMenuBar>
#include <QMessageBox>
#include <QSettings>
#include <QToolBar>
#include <QVBoxLayout>

#include "HelpForMax.h"
#include "MessageBar.h"
#include "TabWidget.h"

MainWindow::MainWindow()
   : QWidget(nullptr)
   , testClient(nullptr)
{
   setWindowTitle("Help For Max");

   QMenuBar* menuBar = new QMenuBar(this);
   QToolBar* toolBar = new QToolBar(this);
   TabWidget* tabWidget = new TabWidget(this);
   MessageBar* messageBar = new MessageBar(this);

   QVBoxLayout* masterLayout = new QVBoxLayout(this);
   masterLayout->setContentsMargins(0, 0, 0, 0);
   masterLayout->addSpacing(0);
   masterLayout->addWidget(menuBar);
   masterLayout->addWidget(toolBar);
   masterLayout->addWidget(tabWidget);
   masterLayout->addWidget(messageBar);

   QMenu* editMenu = menuBar->addMenu("Edit");
   QAction* openPatchAction = editMenu->addAction(QIcon(":/OpenPatch.svg"), "Open", tabWidget, &TabWidget::slotOpenPatch);
   editMenu->addMenu(tabWidget->getRecentMenu());
   QAction* saveRefAction = editMenu->addAction(QIcon(":/SaveAllPatches.svg"), "Save", tabWidget, &TabWidget::slotWriteRef);
   editMenu->addSeparator();
   QAction* closePatchAction = editMenu->addAction(QIcon(":/Editor.svg"), "Close", tabWidget, &TabWidget::slotClosePatch);

   QMenu* testMenu = menuBar->addMenu("Test");
   QAction* testAction = testMenu->addAction(QIcon(":/OpenPackage.svg"), "Test", this, &MainWindow::slotShowTextClient);

   auto spacer = [&]()
   {
      QWidget* widget = new QWidget(this);
      widget->setSizePolicy(QSizePolicy::MinimumExpanding, QSizePolicy::Preferred);

      return widget;
   };

   toolBar->addAction(openPatchAction);
   toolBar->addAction(saveRefAction);
   toolBar->addSeparator();
   toolBar->addAction(closePatchAction);
   toolBar->addWidget(spacer());
   toolBar->addAction(testAction);

   QSettings widgetSettings;
   qDebug() << "SETTINGS @" << widgetSettings.fileName();
   restoreGeometry(widgetSettings.value("MainWidget/Geometry").toByteArray());
}

void MainWindow::slotShowTextClient()
{
   if (testClient.isNull())
      testClient = new TestClient;

   testClient->show();
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

   ce->accept();
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
