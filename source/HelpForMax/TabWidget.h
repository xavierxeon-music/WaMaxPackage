#ifndef TabWidgetH
#define TabWidgetH

#include <QTabWidget>

#include <QLocalServer>

#include "Data/Package.h"

class TabWidget : public QTabWidget
{
   Q_OBJECT

public:
   TabWidget(QWidget* parent);
   ~TabWidget();

public:
   QMenu* getRecentMenu();

public slots:
   void slotOpenPatch();
   void slotWriteRef();
   void slotClosePatch();

private slots:
   void slotNewConnection();
   void slotWindowTitleChanged(const QString& name);
   void slotFillRecentMenu();

private:
   bool openInternal(const QString& patchFileName, const QString& patchName = QString());

private:
   Package package;
   QLocalServer* server;
   QStringList recentFileList;
   QMenu* recentMenu;
};

#endif // NOT TabWidgetH
