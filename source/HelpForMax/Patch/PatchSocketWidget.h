#ifndef SocketPatchWidgetH
#define SocketPatchWidgetH

#include "PatchWidget.h"

namespace Patch
{
   class SocketWidget : public Widget
   {
      Q_OBJECT

   public:
      SocketWidget(QWidget* parent, QLocalSocket* socket);

   private slots:
      void slotReceiveData();

   private:
      void writeRef() override;

   private:
      QPointer<QLocalSocket> socket;
   };

} // namespace Patch

#endif // NOT SocketPatchWidgetH
