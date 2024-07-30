#include "TestClient.h"

#include <QFileInfo>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>

#include <HelpForMax.h>

TestClient::TestClient()
   : QDialog(nullptr)
   , socket(nullptr)
{
   setupUi(this);

   socket = new QLocalSocket(this);
   connect(socket, &QLocalSocket::readyRead, this, &TestClient::slotReceiveData);

   selectTree->setHeaderLabels({"Patch"});
   selectTree->setRootIsDecorated(false);

   auto addItem = [&](const QString& patchPath)
   {
      QFileInfo patchInfo(patchPath);
      const QString patchName = patchInfo.fileName().replace(".maxpat", "");

      QTreeWidgetItem* item = new QTreeWidgetItem(selectTree);
      item->setText(0, patchName);
      item->setData(0, Qt::UserRole + 1, patchPath);
   };

   addItem("/Users/waspe/GitHub/MusicProjects/WaMaxPackage/patchers/hardware/wa.grid.pot.maxpat");
   addItem("/Users/waspe/GitHub/MusicProjects/WaMaxPackage/patchers/audio/wa.wave_terrain~.maxpat");
   addItem("/Users/waspe/GitHub/MusicProjects/WaMaxPackage/patchers/mixer/wa.channel_strip.master~.maxpat");

   connect(selectTree, &QTreeWidget::currentItemChanged, this, &TestClient::slotSelectItemChanged);
}

void TestClient::slotReceiveData()
{
   const QJsonDocument doc = QJsonDocument::fromJson(socket->readAll());
   const QJsonObject object = doc.object();

   const QString path = object["path"].toString();

   resultEdit->append(doc.toJson());
}

void TestClient::slotSelectItemChanged(QTreeWidgetItem* current, QTreeWidgetItem* previous)
{
   Q_UNUSED(previous)

   const QString path = current->data(0, Qt::UserRole + 1).toString();

   sendData(path);
}

void TestClient::sendData(const QString& patchPath)
{
   if (!socket->waitForConnected())
   {
      if (!HelpForMax::isServerActive())
         HelpForMax::startApplication();

      socket->connectToServer(HelpForMax::compileSockerName());
      socket->waitForConnected();
   }

   QJsonObject object;
   object["patch"] = patchPath;

   QJsonDocument doc(object);
   socket->write(doc.toJson(QJsonDocument::Compact));
}
