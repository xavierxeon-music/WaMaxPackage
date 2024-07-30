#include "FileRef.h"

#include <QDebug>
#include <QFile>
#include <QFileInfo>

#include "Package/PackageInfo.h"

void File::Ref::read(Structure* structure, const QString& patchName)
{
   Ref ref(structure);
   ref.read(patchName);
}

void File::Ref::write(Structure* structure, const QString& patchName)
{
   Ref ref(structure);
   ref.write(patchName);
}

QString File::Ref::getFilePath(const QString& patchName)
{
   const QString refPath = Package::Info::getPath() + "/docs/" + patchName + ".maxref.xml";
   return refPath;
}

File::Ref::Ref(Structure* structure)
   : Abstract(structure)
{
}

void File::Ref::read(const QString& patchName)
{
   structure->clear(); // clear old data

   QFile file(getFilePath(patchName));
   if (!file.open(QIODevice::ReadOnly))
      return;

   const QByteArray content = maxFileToDom(file.readAll());
   file.close();

   readContent(content);
}

void File::Ref::write(const QString& patchName)
{
   QFile file(getFilePath(patchName));
   if (!file.open(QIODevice::WriteOnly))
      return;

   QByteArray content = writeContent(patchName);
   content = domToMaxFile(content);

   file.write(content);
   file.close();
}

void File::Ref::readContent(const QByteArray& content)
{
   QDomDocument doc;
   QDomDocument::ParseResult result = doc.setContent(content);
   if (!result.errorMessage.isEmpty())
   {
      qWarning() << "unable to read xml" << result.errorMessage;
      return;
   }

   const QDomElement rootElement = doc.documentElement();
   readDigest(rootElement, structure->patch.digest);

   const QString patcherType = rootElement.attribute("patcher_type", "standard");

   structure->patch.patcherType = Structure::toType(patcherType);

   {
      const QDomElement metaDataElement = rootElement.firstChildElement("metadatalist");
      if (!metaDataElement.isNull())
      {
         const QString& packageName = Package::Info::getName();
         for (const QDomElement& element : compileAllDirectChildElements(metaDataElement, "metadata"))
         {
            const QString& name = element.attribute("name");
            if ("tag" != name)
               continue;

            const QString text = readText(element);
            if (packageName != text)
               structure->patch.metaTagList.append(text);
         }
      }
   }

   {
      const QDomElement outputListElement = findFirstDirectChildElementWithAttributes(rootElement, "misc", {{"name", "Outputs"}});
      if (!outputListElement.isNull())
      {
         for (const QDomElement& outletElement : compileAllDirectChildElements(outputListElement, "entry"))
         {
            const int id = outletElement.attribute("id").toInt();

            Structure::Output output;
            output.name = outletElement.attribute("name");

            readDigest(outletElement, output.digest);

            structure->outputMap[id] = output;
         }
      }
   }

   {
      const QDomElement objArgListElement = rootElement.firstChildElement("objarglist");
      if (!objArgListElement.isNull())
      {
         for (const QDomElement& arguemntElement : compileAllDirectChildElements(objArgListElement, "objarg"))
         {
            Structure::Argument argument;
            argument.name = arguemntElement.attribute("name");
            argument.optional = ("1" == arguemntElement.attribute("optional"));
            argument.type = Structure::toDataType(arguemntElement.attribute("type"));

            readDigest(arguemntElement, argument.digest);

            structure->argumentList.append(argument);
         }
      }
   }

   {
      const QDomElement attributeListElement = rootElement.firstChildElement("attributelist");
      if (!attributeListElement.isNull())
      {
         for (const QDomElement& attributeElement : compileAllDirectChildElements(attributeListElement, "attribute"))
         {
            const QString name = attributeElement.attribute("name");

            Structure::Attribute attribute;
            attribute.get = ("1" == attributeElement.attribute("get"));
            attribute.set = ("1" == attributeElement.attribute("set"));
            attribute.type = Structure::toDataType(attributeElement.attribute("type"));
            attribute.size = attributeElement.attribute("size").toInt();

            readDigest(attributeElement, attribute.digest);

            structure->attributeMap[name] = attribute;
         }
      }
   }

   {
      const QDomElement messageListElement = rootElement.firstChildElement("methodlist");
      if (!messageListElement.isNull())
      {
         for (const QDomElement& messageElement : compileAllDirectChildElements(messageListElement, "method"))
         {
            const QString name = messageElement.attribute("name");

            Structure::Message message;

            const QDomElement argListElement = messageElement.firstChildElement("arglist");
            if (!argListElement.isNull())
            {
               for (const QDomElement& arguemntElement : compileAllDirectChildElements(argListElement, "arg"))
               {
                  Structure::Argument argument;
                  argument.name = arguemntElement.attribute("name");
                  argument.optional = ("1" == arguemntElement.attribute("optional"));
                  argument.type = Structure::toDataType(arguemntElement.attribute("type"));

                  message.arguments.append(argument);
               }
            }

            readDigest(messageElement, message.digest);

            const bool isStandard = ("1" == messageElement.attribute("standard"));
            if (isStandard)
            {
               const Structure::DataType type = Structure::toDataType(name);
               structure->messageTypedMap[type] = message;
            }
            else
            {
               structure->messageNamedMap[name] = message;
            }
         }
      }
   }

   {
      const QDomElement seeAlsoListElement = rootElement.firstChildElement("seealsolist");
      if (!seeAlsoListElement.isNull())
      {
         for (QDomElement element = seeAlsoListElement.firstChildElement("seealso"); !element.isNull(); element = element.nextSiblingElement("seealso"))
         {
            const QString& name = element.attribute("name");
            structure->patch.seeAlsoList.append(name);
         }
      }
   }
}

QByteArray File::Ref::writeContent(const QString& patchName)
{
   QDomDocument doc;

   QDomElement rootElement = doc.createElement("c74object");
   doc.appendChild(rootElement);
   rootElement.setAttribute("name", patchName);

   rootElement.setAttribute("patcher_type", Structure::typeName(structure->patch.patcherType));
   addDigest(rootElement, structure->patch.digest);

   {
      QDomElement metaDataElement = createSubElement(rootElement, "metadatalist");
      createSubElement(metaDataElement, "metadata", Package::Info::getAuthor(), {{"name", "author"}});
      createSubElement(metaDataElement, "metadata", Package::Info::getName(), {{"name", "tag"}});
      for (const QString& tag : structure->patch.metaTagList)
         createSubElement(metaDataElement, "metadata", tag, {{"name", "tag"}});
   }

   {
      QDomElement parserElement = createSubElement(rootElement, "parser");
      parserElement.setAttribute("inlet_count", structure->patch.inletCount);
   }

   {
      QDomElement outputListElement = createSubElement(rootElement, "misc");
      outputListElement.setAttribute("name", "Outputs");
      for (Structure::Output::Map::ConstIterator it = structure->outputMap.constBegin(); it != structure->outputMap.constEnd(); it++)
      {
         QDomElement outputElement = createSubElement(outputListElement, "entry");
         outputElement.setAttribute("name", it.value().name);
         outputElement.setAttribute("id", it.key());

         addDigest(outputElement, it.value().digest);
      }
   }

   {
      QDomElement objArgListElement = createSubElement(rootElement, "objarglist");
      for (const Structure::Argument& argument : structure->argumentList)
      {
         QDomElement arguemntElement = createSubElement(objArgListElement, "objarg");
         arguemntElement.setAttribute("name", argument.name);
         arguemntElement.setAttribute("optional", argument.optional);
         arguemntElement.setAttribute("type", Structure::dataTypeName(argument.type));

         addDigest(arguemntElement, argument.digest);
      }
   }

   {
      QDomElement attributeListElement = createSubElement(rootElement, "attributelist");
      for (Structure::Attribute::Map::ConstIterator it = structure->attributeMap.constBegin(); it != structure->attributeMap.constEnd(); it++)
      {
         const Structure::Attribute& attribute = it.value();

         QDomElement attributeElement = createSubElement(attributeListElement, "attribute");
         attributeElement.setAttribute("name", it.key());
         attributeElement.setAttribute("get", attribute.get);
         attributeElement.setAttribute("set", attribute.set);
         attributeElement.setAttribute("type", Structure::dataTypeName(attribute.type));
         attributeElement.setAttribute("size", attribute.size);

         addDigest(attributeElement, attribute.digest);
      }
   }

   {
      QDomElement messageListElement = createSubElement(rootElement, "methodlist");

      auto addMessage = [&](const Structure::Message& message, const QString& name, const bool isStandard)
      {
         QDomElement messageElement = createSubElement(messageListElement, "method");
         messageElement.setAttribute("name", name);
         messageElement.setAttribute("standard", isStandard);

         if (!message.arguments.empty() && !isStandard)
         {
            QDomElement argListElement = createSubElement(messageElement, "arglist");
            for (const Structure::Argument& argument : message.arguments)
            {
               QDomElement arguemntElement = createSubElement(argListElement, "arg");
               arguemntElement.setAttribute("name", argument.name);
               arguemntElement.setAttribute("optional", argument.optional);
               arguemntElement.setAttribute("type", Structure::dataTypeName(argument.type));
            }
         }

         addDigest(messageElement, message.digest);
      };

      for (Structure::Message::TypeMap::ConstIterator it = structure->messageTypedMap.constBegin(); it != structure->messageTypedMap.constEnd(); it++)
      {
         const Structure::Message& message = it.value();
         const QString& name = Structure::dataTypeName(it.key());
         addMessage(message, name, true);
      }

      for (Structure::Message::NameMap::ConstIterator it = structure->messageNamedMap.constBegin(); it != structure->messageNamedMap.constEnd(); it++)
      {
         const Structure::Message& message = it.value();
         const QString& name = it.key();
         addMessage(message, name, false);
      }
   }

   {
      QDomElement seeAlsoListElement = createSubElement(rootElement, "seealsolist");
      for (const QString& seeAlso : structure->patch.seeAlsoList)
      {
         createSubElement(seeAlsoListElement, "seealso", QString(), {{"name", seeAlso}});
      }
   }

   QByteArray content;
   content += "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>\n";
   content += "<?xml-stylesheet href=\"./_c74_ref.xsl\" type=\"text/xsl\"?>\n";
   content += doc.toByteArray(4);

   return content;
}

QDomElement File::Ref::createSubElement(QDomElement parent, const QString& name, const QString& text, const TagMap& tagMap)
{
   QDomElement element = parent.ownerDocument().createElement(name);
   parent.appendChild(element);

   if (!text.isEmpty())
   {
      QDomText textNode = parent.ownerDocument().createTextNode(text);
      element.appendChild(textNode);
   }

   for (TagMap::ConstIterator it = tagMap.constBegin(); it != tagMap.constEnd(); it++)
   {
      element.setAttribute(it.key(), it.value());
   }

   return element;
}

void File::Ref::addDigest(const QDomElement& parentElement, const Structure::Digest& digest)
{
   createSubElement(parentElement, "digest", digest.text);
   if (!digest.description.isEmpty())
   {
      QString description = digest.description;
      description.replace("\n", "&lt;br/&gt;");
      createSubElement(parentElement, "description", description);
   }
}

void File::Ref::readDigest(const QDomElement& parentElement, Structure::Digest& digest) const
{
   const QDomElement textElement = parentElement.firstChildElement("digest");
   digest.text = readText(textElement);

   const QDomElement descriptionElement = parentElement.firstChildElement("description");
   digest.description = readText(descriptionElement);
}

QString File::Ref::readText(const QDomElement& element) const
{
   if (element.isNull())
      return QString();

   const QDomText textNode = element.firstChild().toText();
   if (textNode.isNull())
      return QString();

   return textNode.data();
}

QDomElement File::Ref::findFirstDirectChildElementWithAttributes(const QDomElement& element, const QString& tag, const TagMap& tagMap) const
{
   for (QDomElement childElement = element.firstChildElement(tag); !childElement.isNull(); childElement = childElement.nextSiblingElement(tag))
   {
      auto hasTags = [&]()
      {
         if (tagMap.empty())
            return true;

         for (TagMap::ConstIterator it = tagMap.constBegin(); it != tagMap.constEnd(); it++)
         {
            if (!childElement.hasAttribute(it.key()))
               continue;

            if (it.value() == childElement.attribute(it.key()))
               return true;
         }

         return false;
      };

      if (hasTags())
         return childElement;
   }
   return QDomElement();
}

QList<QDomElement> File::Ref::compileAllDirectChildElements(const QDomElement& element, const QString& tag, const TagMap& tagMap) const
{
   QList<QDomElement> list;
   for (QDomElement childElement = element.firstChildElement(tag); !childElement.isNull(); childElement = childElement.nextSiblingElement(tag))
   {
      auto hasTags = [&]()
      {
         if (tagMap.empty())
            return true;

         for (TagMap::ConstIterator it = tagMap.constBegin(); it != tagMap.constEnd(); it++)
         {
            if (!childElement.hasAttribute(it.key()))
               continue;

            if (it.value() == childElement.attribute(it.key()))
               return true;
         }

         return false;
      };

      if (!hasTags())
         continue;

      list.append(childElement);
   }

   return list;
}

QByteArray File::Ref::domToMaxFile(QByteArray domXML) const
{
   domXML.replace("&amp;", "&");
   domXML.replace("&lt;", "<");
   domXML.replace("&gt;", ">");

   return domXML;
}

QByteArray File::Ref::maxFileToDom(QByteArray maxXML) const
{
   for (const QByteArray& tag : Structure::descriptionMaxTags)
   {
      maxXML.replace("<" + tag + ">", "&lt;" + tag + "&gt;");
      maxXML.replace("</" + tag + ">", "&lt;/" + tag + "&gt;");
   }
   maxXML.replace("<br/>", "\n");

   return maxXML;
}
