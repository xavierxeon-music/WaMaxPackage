#include "Structure.h"

const QList<QByteArray> Structure::descriptionMaxTags = {"o", "m", "at", "ar", "b", "u", "i"};

const QMap<Structure::Type, QString> Structure::typeNameMap = {{Type::Anything, "anything"}, // must be max names!
                                                               {Type::Bang, "bang"},
                                                               {Type::Integer, "int"},
                                                               {Type::Float, "float"},
                                                               {Type::Symbol, "symbol"},
                                                               {Type::List, "list"},
                                                               {Type::Signal, "signal"},
                                                               {Type::MultiSignal, "multichannelsignal"},
                                                               {Type::Dictionary, "dictionary"},
                                                               {Type::Matrix, "matrix"}};

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

QString Structure::typeName(const Type& type)
{
   return typeNameMap.value(type, "???");
}

Structure::Type Structure::toType(const QString& name)
{
   for (QMap<Type, QString>::ConstIterator it = typeNameMap.constBegin(); it != typeNameMap.constEnd(); it++)
   {
      if (name == it.value())
         return it.key();
   }

   return Type::Anything;
}

QList<Structure::Type> Structure::typeList()
{
   return typeNameMap.keys();
}

void Structure::setDirty()
{
}
