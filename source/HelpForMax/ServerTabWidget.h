#ifndef TabWidgetH
#define TabWidgetH

#include <QTabWidget>

#include <QLocalServer>

class ServerTabWidget : public QTabWidget
{
   Q_OBJECT

public:
   ServerTabWidget(QWidget* parent);

public slots:
   void slotSaveCurrentPatch();

private:
   friend class Socket;

private slots:
   void slotNewConnection();

private:
   QLocalServer* server;
};

#endif // NOT TabWidgetH
