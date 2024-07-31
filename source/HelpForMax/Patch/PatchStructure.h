#ifndef PatchStructureH
#define PatchStructureH

#include <QObject>

#include <QIcon>
#include <QMap>
#include <QString>
#include <QStringList>

namespace Patch
{

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
      Q_ENUM(DataType)

      enum class PatchType
      {
         Standard,
         Gui,
         Poly,
         Fourier
      };
      Q_ENUM(PatchType)

      enum class PatchPart
      {
         Undefined = 0x00,
         Header = 0x01,
         Argument = 0x02,
         Attribute = 0x04,
         MessageTyped = 0x08,
         MessageNamed = 0x10,
         Output = 0x20
      };
      Q_ENUM(PatchPart)
      Q_DECLARE_FLAGS(PatchParts, PatchPart)

      static const QList<QByteArray> descriptionMaxTags;

      struct Digest
      {
         QString text;
         QString description;
      };

      struct Header
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

      struct Input
      {
         DataType dataType = DataType::Symbol;
         Digest digest;
      };

      struct MessageTyped : Input
      {
         using Map = QMap<DataType, MessageTyped>;
      };

      // attributes and things in patcherargs with @
      struct MessageNamed : Input
      {
         QString name;
         PatchParts patchParts = PatchPart::Undefined;

         using Map = QMap<QString, MessageNamed>;
      };

      // things in patcherargs without @
      struct Argument : Input
      {
         QString name;
         bool optional = false;

         using List = QList<Argument>;
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
      static QString patchTypeName(const PatchType& type);
      static PatchType toPatchType(const QString& name);
      static QList<PatchType> patchTypeList();

      // part
      static QString partName(const PatchPart& part);
      static QIcon partIcon(const PatchPart& part);
      static PatchPart toPart(const QString& name);

   public:
      Header header;
      Output::Map outputMap;
      Argument::List argumentList;
      MessageTyped::Map messageTypedMap;
      MessageNamed::Map messageNamedMap;
   };
} // namespace Patch

Q_DECLARE_OPERATORS_FOR_FLAGS(Patch::Structure::PatchParts)

#endif // NOT PatchStructureH
