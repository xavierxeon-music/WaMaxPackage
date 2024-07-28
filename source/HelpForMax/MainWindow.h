#ifndef MainWindowH
#define MainWindowH

#include <QWidget>

#include <QPointer>

#include "TabWidget.h"

#include "TestClient.h"

class MainWindow : public QWidget
{
   Q_OBJECT

public:
   MainWindow();

private slots:
   void slotShowTextClient();

private:
   void setModified(bool enabled, QString key);
   void closeEvent(QCloseEvent* ce) override;

private:
   TabWidget* tabWidget;

   QPointer<TestClient> testClient;
};

#endif // NOT MainWindowH
