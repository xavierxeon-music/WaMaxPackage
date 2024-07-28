#ifndef SocketPatchWidgetH
#define SocketPatchWidgetH

#include "PatchWidget.h"

class SocketPatchWidget : public PatchWidget
{
   Q_OBJECT

public:
   SocketPatchWidget(QWidget* parent, QLocalSocket* socket);

private slots:
   void slotReceiveData();

private:
   void writeRef() override;

private:
   QPointer<QLocalSocket> socket;
};

#endif // NOT SocketPatchWidgetH
