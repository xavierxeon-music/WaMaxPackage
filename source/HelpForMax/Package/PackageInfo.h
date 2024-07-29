#ifndef PackageInfoH
#define PackageInfoH

#include <QFileInfo>
#include <QString>

namespace Patch
{
   class TabWidget;
}

namespace Package
{
   class Info
   {
   public:
      static QString setPatchPath(const QString& package); // return patch name
      static QString getPath();
      static QString getName();
      static QString getAuthor();

   private:
      friend class Patch::TabWidget;

   private:
      Info();
      ~Info();

   private:
      void update(const QFileInfo& patchInfo);

   private:
      static Info* me;
      QString path;
      QString name;
      QString author;
   };
} // namespace Package

#endif // NOT PackageInfoH
