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

   protected:
      Info();
      ~Info();

   protected:
      virtual void clearContent() = 0;
      virtual void createContent(const QString& packagePath) = 0;
      void update(const QFileInfo& patchInfo);

   protected:
      QString path;
      QString name;
      QString author;

   private:
      static Info* me;
   };
} // namespace Package

#endif // NOT PackageInfoH
