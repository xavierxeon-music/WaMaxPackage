#ifndef PackageH
#define PackageH

#include <QFileInfo>
#include <QString>

class Package
{
public:
   static QString setPatchPath(const QString& package); // return patch name
   static QString getPath();
   static QString getName();
   static QString getAuthor();

private:
   friend class TabWidget;

private:
   Package();
   ~Package();

private:
   void update(const QFileInfo& patchInfo);

private:
   static Package* me;
   QString path;
   QString name;
   QString author;
};

#endif // NOT PackageH
