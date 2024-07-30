#ifndef StructureH
#define StructureH

#include <QObject>

#include <QMap>
#include <QString>
#include <QStringList>

class Structure
{
   Q_GADGET

public:
   enum class DataType
   {
      Anything,
      Symbol,
      Float,
      Integer,
      Bang,
      List,
      Signal,
      MultiSignal,
      Dictionary,
      Matrix
   };
   Q_ENUM(DataType);

   enum class PatchType
   {
      Standard,
      Gui,
      Poly,
      Fourier
   };
   Q_ENUM(PatchType);

   enum class PatchPart
   {
      Undefined,
      Patch,
      Argument,
      Attribute,
      MessageTyped,
      MessageNamed,
      Output
   };
   Q_ENUM(PatchPart);

   static const QList<QByteArray> descriptionMaxTags;

   struct Digest
   {
      QString text;
      QString description;
   };

   struct Patch
   {
      Digest digest;
      PatchType patcherType = PatchType::Standard;
      int inletCount = 0;
      QStringList metaTagList;
      QStringList seeAlsoList;
   };

   struct Output
   {
      QString name;
      Digest digest;

      using Map = QMap<int, Output>; // outlet number vs port
   };

   // things in patcherargs without @
   // message arguments
   struct Argument
   {
      QString name;
      bool optional = false;
      DataType type = DataType::Symbol;
      Digest digest;

      using List = QList<Argument>;
   };

   struct Message
   {
      Argument::List arguments;
      Digest digest;

      using TypeMap = QMap<DataType, Message>;
      using NameMap = QMap<QString, Message>; // name vs message
   };

   // things in patcherargs with @
   struct Attribute
   {
      bool get = true;
      bool set = true;
      DataType type = DataType::Symbol;
      int size = 1;
      Digest digest;

      using Map = QMap<QString, Attribute>; // name vs message
   };

   using SeeAlsoList = QStringList;

public:
   Structure();
   virtual ~Structure();

public:
   virtual void clear();
   virtual void setDirty();

   // message type
   static QString dataTypeName(const DataType& type);
   static DataType toDataType(const QString& name);
   static QList<DataType> dataTypeList();

   // patcher type
   static QString typeName(const PatchType& type);
   static PatchType toType(const QString& name);

   // part
   static QString partName(const PatchPart& part);
   static PatchPart toPart(const QString& name);

public:
   Patch patch;
   Output::Map outputMap;
   Argument::List argumentList;
   Attribute::Map attributeMap;
   Message::TypeMap messageTypedMap;
   Message::NameMap messageNamedMap;
};

#endif // NOT StructureH
