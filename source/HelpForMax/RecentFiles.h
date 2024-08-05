#ifndef RecentFilesH
#define RecentFilesH

#include <QFileInfo>
#include <QString>
#include <QWidget>

class RecentFiles
{
public:
   RecentFiles(QWidget* parent, const QString& settingsKey);
   ~RecentFiles();

public:
   QMenu* getRecentMenu();

protected:
   struct Entry
   {
      QString name;
      std::function<void()> openFunction;
   };

protected:
   void addRecentFile(const QString& fileName);
   virtual Entry creatreEntry(const QFileInfo& fileInfo) = 0;

private:
   void populate();

private:
   QString settingsKey;
   QStringList fileList;
   QMenu* recentMenu;
};

#endif // NOT RecentFilesH
