#include "Structure.h"

// structure

const QList<QByteArray> Structure::descriptionMaxTags = {"o", "m", "at", "ar", "b", "u", "i"};

using DataTypeNameMap = QMap<Structure::DataType, QString>;
static const DataTypeNameMap dataTypeNameMap = {{Structure::DataType::Anything, "anything"}, // must be max names!
                                                {Structure::DataType::Bang, "bang"},
                                                {Structure::DataType::Integer, "int"},
                                                {Structure::DataType::Float, "float"},
                                                {Structure::DataType::Symbol, "symbol"},
                                                {Structure::DataType::List, "list"},
                                                {Structure::DataType::Signal, "signal"},
                                                {Structure::DataType::MultiSignal, "multichannelsignal"},
                                                {Structure::DataType::Dictionary, "dictionary"},
                                                {Structure::DataType::Matrix, "matrix"}};

using PatchTypeNameMap = QMap<Structure::PatchType, QString>;
static const PatchTypeNameMap patchTypeNameMap = {{Structure::PatchType::Standard, "standard"},
                                                  {Structure::PatchType::Gui, "gui"},
                                                  {Structure::PatchType::Poly, "poly"},
                                                  {Structure::PatchType::Fourier, "fourier"}};

using PatchPartNameMap = QMap<Structure::PatchPart, QString>;
static const PatchPartNameMap patchPartNameMap = {{Structure::PatchPart::Undefined, "undefined"},
                                                  {Structure::PatchPart::Patch, "patch"},
                                                  {Structure::PatchPart::Argument, "argument"},
                                                  {Structure::PatchPart::Attribute, "attribute"},
                                                  {Structure::PatchPart::MessageTyped, "message_typed"},
                                                  {Structure::PatchPart::MessageNamed, "message_named"},
                                                  {Structure::PatchPart::Output, "putput"}};

Structure::Structure()
   : patch()
   , outputMap()
   , argumentList()
   , attributeMap()
   , messageTypedMap()
   , messageNamedMap()
{
}

Structure::~Structure()
{
}

void Structure::clear()
{
   *this = Structure();
}

void Structure::setDirty()
{
}

QString Structure::dataTypeName(const DataType& type)
{
   return dataTypeNameMap.value(type, "anything");
}

Structure::DataType Structure::toDataType(const QString& name)
{
   for (DataTypeNameMap ::ConstIterator it = dataTypeNameMap.constBegin(); it != dataTypeNameMap.constEnd(); it++)
   {
      if (name == it.value())
         return it.key();
   }

   return DataType::Anything;
}

QList<Structure::DataType> Structure::dataTypeList()
{
   return dataTypeNameMap.keys();
}

QString Structure::typeName(const PatchType& type)
{
   return patchTypeNameMap.value(type, "standard");
}

Structure::PatchType Structure::toType(const QString& name)
{
   for (PatchTypeNameMap::ConstIterator it = patchTypeNameMap.constBegin(); it != patchTypeNameMap.constEnd(); it++)
   {
      if (name == it.value())
         return it.key();
   }

   return PatchType::Standard;
   ;
}

QString Structure::partName(const Structure::PatchPart& part)
{
   return patchPartNameMap.value(part, "undefined");
}

Structure::PatchPart Structure::toPart(const QString& name)
{
   for (PatchPartNameMap ::ConstIterator it = patchPartNameMap.constBegin(); it != patchPartNameMap.constEnd(); it++)
   {
      if (name == it.value())
         return it.key();
   }

   return PatchPart::Undefined;
   ;
}
