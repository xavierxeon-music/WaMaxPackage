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
            argument.dataType = Structure::toDataType(arguemntElement.attribute("type"));

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
            if (!structure->messageNamedMap.contains(name))
            {
               Structure::MessageNamed attribute;
               attribute.dataType = Structure::toDataType(attributeElement.attribute("type"));

               readDigest(attributeElement, attribute.digest);

               structure->messageNamedMap[name] = attribute;
            }

            structure->messageNamedMap[name].patchParts |= Structure::PatchPart::Attribute;
         }
      }
   }

   {
      const QDomElement messageListElement = rootElement.firstChildElement("methodlist");
      if (!messageListElement.isNull())
      {
         for (const QDomElement& messageElement : compileAllDirectChildElements(messageListElement, "method"))
         {
            const bool isStandard = ("1" == messageElement.attribute("standard"));
            const QString name = messageElement.attribute("name");
            if (isStandard)
            {
               Structure::MessageTyped message;
               readDigest(messageElement, message.digest);

               message.dataType = Structure::toDataType(name);

               structure->messageTypedMap[message.dataType] = message;
            }
            else
            {
               Structure::MessageNamed message;
               if (!structure->messageNamedMap.contains(name))
               {
                  readDigest(messageElement, message.digest);

                  const QDomElement argListElement = messageElement.firstChildElement("arglist");
                  const QDomElement& arguemntElement = argListElement.firstChildElement("arg");
                  //message.optional = ("1" == arguemntElement.attribute("optional"));
                  message.dataType = Structure::toDataType(arguemntElement.attribute("type"));

                  structure->messageNamedMap[name] = message;
               }

               structure->messageNamedMap[name].patchParts |= Structure::PatchPart::MessageNamed;
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
         arguemntElement.setAttribute("type", Structure::dataTypeName(argument.dataType));

         addDigest(arguemntElement, argument.digest);
      }
   }

   {
      QDomElement attributeListElement = createSubElement(rootElement, "attributelist");
      QDomElement messageListElement = createSubElement(rootElement, "methodlist");

      for (Structure::MessageNamed::Map::ConstIterator it = structure->messageNamedMap.constBegin(); it != structure->messageNamedMap.constEnd(); it++)
      {
         const Structure::MessageNamed& messageNamed = it.value();
         if (0 != (messageNamed.patchParts & Structure::PatchPart::MessageNamed))
         {
            QDomElement messageElement = createSubElement(messageListElement, "method");
            messageElement.setAttribute("name", messageNamed.name);
            messageElement.setAttribute("standard", 0);

            QDomElement argListElement = createSubElement(messageElement, "arglist");

            QDomElement arguemntElement = createSubElement(argListElement, "arg");
            arguemntElement.setAttribute("name", messageNamed.name);
            arguemntElement.setAttribute("optional", 0);
            arguemntElement.setAttribute("type", Structure::dataTypeName(messageNamed.dataType));

            addDigest(messageElement, messageNamed.digest);
         }
         else if (0 != (messageNamed.patchParts & Structure::PatchPart::Attribute))
         {
            QDomElement attributeElement = createSubElement(attributeListElement, "attribute");
            attributeElement.setAttribute("name", messageNamed.name);
            attributeElement.setAttribute("get", 0);
            attributeElement.setAttribute("set", 1);
            attributeElement.setAttribute("type", Structure::dataTypeName(messageNamed.dataType));
            attributeElement.setAttribute("size", 1);

            addDigest(attributeElement, messageNamed.digest);
         }
      }

      for (Structure::MessageTyped::Map::ConstIterator it = structure->messageTypedMap.constBegin(); it != structure->messageTypedMap.constEnd(); it++)
      {
         const Structure::MessageTyped& messageTyped = it.value();

         QDomElement messageElement = createSubElement(messageListElement, "method");
         messageElement.setAttribute("name", Structure::dataTypeName(messageTyped.dataType));
         messageElement.setAttribute("standard", 1);

         addDigest(messageElement, messageTyped.digest);
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
