#ifndef FileRefH
#define FileRefH

#include "FileAbstract.h"

#include <QDomElement>

namespace File
{
   class Ref : public Abstract
   {
   public:
      static void read(Structure* structure, const QString& patchName);
      static void write(Structure* structure, const QString& patchName);
      static QString getFilePath(const QString& patchName);

   public:
      Ref(Structure* structure);

   private:
      using TagMap = QMap<QString, QString>;

   private:
      void read(const QString& patchName);
      void write(const QString& patchName);

      void readContent(const QByteArray& content);
      QByteArray writeContent(const QString& patchName);

      QDomElement createSubElement(QDomElement parent, const QString& name, const QString& text = QString(), const TagMap& tagMap = TagMap());
      void addDigest(const QDomElement& parentElement, const Structure::Digest& digest);

      void readDigest(const QDomElement& parentElement, Structure::Digest& digest) const;
      QString readText(const QDomElement& element) const;
      QDomElement findFirstDirectChildElementWithAttributes(const QDomElement& element, const QString& tag, const TagMap& tagMap) const;
      QList<QDomElement> compileAllDirectChildElements(const QDomElement& element, const QString& tag, const TagMap& tagMap = TagMap()) const;

      QByteArray domToMaxFile(QByteArray domXML) const;
      QByteArray maxFileToDom(QByteArray maxXML) const;
   };
} // namespace File

#endif // NOT FileRefH
