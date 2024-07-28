#ifndef BlockRefH
#define BlockRefH

#include "Structure.h"

#include <QDomElement>

class Block : public Structure
{
public:
   Block();

public:
   void read(const QString& patchName);
   void write(const QString& patchName);

private:
   using TagMap = QMap<QString, QString>;

private:
   void readContent(const QString& content);
   QString writeContent(const QString& patchName);

   QDomElement createSubElement(QDomElement parent, const QString& name, const QString& text = QString(), const TagMap& tagMap = TagMap());
   void addDigest(const QDomElement& parentElement, const Structure::Digest& digest);

   void readDigest(const QDomElement& parentElement, Structure::Digest& digest) const;
   QString readText(const QDomElement& element) const;
   QDomElement findFirstDirectChildElementWithAttributes(const QDomElement& element, const QString& tag, const TagMap& tagMap) const;
   QList<QDomElement> compileAllDirectChildElements(const QDomElement& element, const QString& tag, const TagMap& tagMap = TagMap()) const;

   QString domToMaxFile(QString domXML) const;
   QString maxFileToDom(QString maxXML) const;

   void markUndocumented(Base& base);

private:
   static const QList<QByteArray> descriptionMaxTags;
};

#endif // NOT BlockRefH
