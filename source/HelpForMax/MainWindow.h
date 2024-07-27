#ifndef MainWindowH
#define MainWindowH

#include <QWidget>

#include <QSplitter>

#include "Server.h"

class MainWindow : public QWidget
{
   Q_OBJECT

public:
   MainWindow();

private:
   void setModified(bool enabled, QString key);
   void closeEvent(QCloseEvent* ce) override;

private:
   QSplitter* splitter;
   Server* server;
};

#endif // NOT MainWindowH
