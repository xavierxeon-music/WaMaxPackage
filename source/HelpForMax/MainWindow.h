#ifndef MainWindowH
#define MainWindowH

#include <QWidget>

#include <QTabWidget>

#include "ServerTabWidget.h"

class MainWindow : public QWidget
{
   Q_OBJECT

public:
   MainWindow();

private:
   void setModified(bool enabled, QString key);
   void closeEvent(QCloseEvent* ce) override;

private:
   ServerTabWidget* contentWidget;
};

#endif // NOT MainWindowH
