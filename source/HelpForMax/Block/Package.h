#ifndef PackageH
#define PackageH

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
   static Package* me;
   QString path;
   QString name;
   QString author;
};

#endif // NOT PackageH
