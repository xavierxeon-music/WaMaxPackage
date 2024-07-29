#ifndef BlockRefH
#define BlockRefH

#include "Structure.h"
#include <QObject>

#include <QDomElement>

class Block : public Structure
{
   Q_GADGET

public:
   enum Role
   {
      RoleMarker = Qt::UserRole + 1,
      RoleData = Qt::UserRole + 2
   };

   enum class Marker
   {
      Undefined,
      Patch,
      Argument,
      Attribute,
      MessageStandard,
      MessageUserDefined,
      Output
   };
   Q_ENUM(Marker)

public:
   Block();
   virtual ~Block();

public:
   void read(const QString& patchName);
   void write(const QString& patchName);
   void setDirty();

public:
   static const QBrush udocBrush;
   static const QBrush docBrush;

private:
   using TagMap = QMap<QString, QString>;

private:
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

   void markUndocumented(Base& base);

private:
   static const QList<QByteArray> descriptionMaxTags;
};

#endif // NOT BlockRefH
