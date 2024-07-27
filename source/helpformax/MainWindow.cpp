#include "MainWindow.h"

#include <QApplication>
#include <QCloseEvent>
#include <QMenu>
#include <QMenuBar>
#include <QMessageBox>
#include <QSettings>
#include <QVBoxLayout>

#include <HelpForMax.h>

MainWindow::MainWindow()
   : QWidget(nullptr)
   , contentWidget(nullptr)
   , server(nullptr)
{
   setWindowTitle("Help For Max");

   server = new Server(this);

   QMenuBar* menuBar = new QMenuBar(this);
   QMenu* manualMenu = menuBar->addMenu("Manual");
   Q_UNUSED(manualMenu)

   contentWidget = new QTableWidget(this);

   QVBoxLayout* masterLayout = new QVBoxLayout(this);
   masterLayout->setContentsMargins(0, 0, 0, 0);
   masterLayout->addSpacing(0);
   masterLayout->addWidget(menuBar);
   masterLayout->addWidget(contentWidget);

   QSettings widgetSettings;
   qDebug() << "SETTINGS @" << widgetSettings.fileName();
   restoreGeometry(widgetSettings.value("MainWidget/Geometry").toByteArray());
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
