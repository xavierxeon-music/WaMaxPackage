autowatch = 1;

// inlets and outlets
inlets = 1;
setinletassist(0, "fileName");

outlets = 0;

function saveJsonFile(object, fileName) {

   var file = new File(fileName, "write");

   var content = JSON.stringify(object);
   file.writestring(content);

   file.close();
}

//////////////////////////////////////////

function ObjectId() {

   this.count = 1;
   this.map = {};

   return this;
}

ObjectId.prototype.get = function (object) {

   if (null === object)
      return "§_null";
   else if (undefined === object)
      return "§_undef";

   if (!object.__uuid__) {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
         s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";

      object.__uuid__ = s.join("");
   }

   var id = this.map[object.__uuid__];

   if (undefined == id) {
      id = "§_" + this.count;
      this.count++;

      this.map[object.__uuid__] = id;
   }
   return id;
}

function TreeDunp() {

   var topPatcher = this.patcher;
   while (topPatcher.parentpatcher) {
      topPatcher = topPatcher.parentpatcher;
   }

   this.objectId = new ObjectId();
   var topJsonObject = {};

   this.crawl = function (object, jsonObject) {

      if (!object)
         return;

      var id = this.objectId.get(object);
      jsonObject["id"] = id;

      var attrObject = {};
      if (object.getattrnames) {
         var attrNames = object.getattrnames();
         for (var index in attrNames) {
            var key = attrNames[index];
            var value = object.getattr(key);
            attrObject[key] = value;
         }
      }
      jsonObject["attributes"] = attrObject;

      var boxAttrObject = {};
      if (object.getboxattrnames) {
         var boxAttrNames = object.getboxattrnames();
         for (var index in boxAttrNames) {
            var key = boxAttrNames[index];
            var value = object.getboxattr(key);
            boxAttrObject[key] = value;
         }
      }
      jsonObject["box_attributes"] = boxAttrObject;

      var propertyObject = {};
      for (var key in object) {
         //if (key !== "name" && key !== "maxclass")
         //   continue;

         var value = object[key];
         if ("object" !== typeof value)
            propertyObject[key] = value;
         else {
            propertyObject[key] = this.objectId.get(value);
         }
      }
      jsonObject["properties"] = propertyObject;

      var childrenArray = [];
      if ("firstobject" in object) {

         for (var child = object.firstobject; child !== null; child = child.nextobject) {
            var childObject = {};
            crawl(child, childObject, objectId);
            childrenArray.push(childObject);
         }

      }
      jsonObject["children"] = childrenArray;
   }

   this.crawl(topPatcher, topJsonObject);

   return topJsonObject;
}





//////////////////////////////////////////

function write(fileName) {

   saveJsonFile(TreeDunp(), fileName);
}

