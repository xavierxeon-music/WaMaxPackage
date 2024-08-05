#include "RecentFiles.h"

#include <QMenu>
#include <QSettings>

RecentFiles::RecentFiles(QWidget* parent, const QString& settingsKey)
   : settingsKey(settingsKey)
   , fileList()
   , recentMenu(nullptr)
{
   recentMenu = new QMenu("Recent", parent);

   auto populateFunction = std::bind(&RecentFiles::populate, this);
   QObject::connect(recentMenu, &QMenu::aboutToShow, populateFunction);

   QSettings settings;
   fileList = settings.value(settingsKey).toStringList();
}

RecentFiles::~RecentFiles()
{
   QSettings settings;
   settings.setValue(settingsKey, fileList);
}

QMenu* RecentFiles::getRecentMenu()
{
   return recentMenu;
}

void RecentFiles::addRecentFile(const QString& fileName)
{
   if (!fileList.contains(fileName))
      fileList.append(fileName);

   while (fileList.size() > 10)
      fileList.takeFirst();
}

void RecentFiles::populate()
{
   recentMenu->clear();
   for (const QString& fileName : fileList)
   {
      QFileInfo fileInfo(fileName);
      Entry entry = creatreEntry(fileInfo);

      recentMenu->addAction(entry.name, entry.openFunction);
   }

   auto clearFunction = [this]
   {
      this->fileList.clear();
   };

   recentMenu->addSeparator();
   recentMenu->addAction("Clear Recent", clearFunction);
}
