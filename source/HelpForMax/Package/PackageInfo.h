#ifndef PackageInfoH
#define PackageInfoH

#include <QFileInfo>
#include <QString>

namespace Package
{
   class Info
   {
   public:
      static bool setPackage(const QString& someFileInPackage); // true if no package was set or is same package
      static QString extractPatchName(const QString& patchFileName);
      static QString getPath();
      static QString getName();
      static QString getAuthor();

   protected:
      Info();
      ~Info();

   protected:
      virtual void clear();
      bool update(const QString& someFileInPackage);
      virtual void create(const QString& packagePath) = 0;

   protected:
      QString path;
      QString name;
      QString author;

   private:
      static Info* me;
   };
} // namespace Package

#endif // NOT PackageInfoH
