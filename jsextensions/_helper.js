// helpers

function readJsonFile(fileName) {

   var text = "";
   var file = new File(fileName, "read");
   while (file.isopen && file.position < file.eof) {
      text += file.readline();
   }
   file.close();

   var object = JSON.parse(text);
   return object;
}

function removeFromArray(array, value) {

   for (var index = 0; index < array.length; index++) {

      if (array[index] !== value)
         continue;

      array.splice(index, 1);
      return;
   }
}

function getPresentationRectanlge(object) {

   var objectPatchName = object.patcher.name;

   var topPatcher = object.patcher;
   while (topPatcher.parentpatcher) {
      topPatcher = topPatcher.parentpatcher;
   }

   for (var child = topPatcher.firstobject; child !== null; child = child.nextobject) {

      if ("patcher" !== child.maxclass)
         continue;

      var patchName = child.getattr("name");
      if (patchName !== objectPatchName)
         continue;

      var box_rect = child.getboxattr("presentation_rect");
      return box_rect;
   }

   return null;
}

function print() {

   for (var index = 0; index < arguments.length; index++)
      post(arguments[index]);
   post("\n");
}

function dump(obj, name) {

   if (obj === null) {
      print(name + " : NULL");
   }
   else if (obj === undefined) {
      print(name + " : UNDEFINED");
   }
   else if (typeof obj == "number") {
      print(name + " :" + obj, " (NUMBER)");
   }
   else if (typeof obj == "string") {
      print(name + " :" + obj, "  (STRING)");
   }
   else if (typeof obj == "object") {
      for (var key in obj) {
         dump(obj[key], name + "," + key);
      }
   }
   else {
      print(name + " is " + typeof obj);

   }
}

function isHex(value) {

   for (var index = 0; index < 6; index += 1) {

      var test = value[index];
      switch (test) {
         case "0":
         case "1":
         case "2":
         case "3":
         case "4":
         case "5":
         case "6":
         case "7":
         case "8":
         case "9":
         case "a":
         case "b":
         case "c":
         case "d":
         case "e":
         case "f":
            continue;
         default:
            return false;
      }
   }

   return true;
}

//////////////////////////////////////////

function Inspector(fileName) {

   this.file = new File(fileName, "write");
   print(fileName, this.file.isopen);

   return this;
}

Inspector.prototype.done = function () {

   this.file.close();
}

Inspector.prototype.dump = function (object) {

   this.file.writeline("*** " + object.maxclass)

   if (undefined !== object.getattrnames) {

      this.file.writeline("");

      var attrNames = object.getattrnames();
      for (var index in attrNames) {
         var key = attrNames[index];
         var value = object.getattr(key);
         this.file.writestring(key + " : ");
         this.file.writestring(typeof value + " : ");
         this.file.writeline(value);
      }

   }

   this.file.writeline("");

   for (var key in object) {
      var value = object[key];
      this.file.writestring(key + " : ");
      this.file.writestring(typeof value + " : ");
      this.file.writeline(value);

      if ("firstobject" === key) {
         for (var child = object.firstobject; child !== null; child = child.nextobject) {
            var child_rect = child.getattr("presentation_rect");
            var box_rect = child.getboxattr("presentation_rect");

            this.file.writestring(" * " + child.maxclass);
            if (child_rect) {
               this.file.writestring(" : " + child_rect);
            }
            if (box_rect) {
               this.file.writestring(" : " + box_rect);
            }
            this.file.writeline("");
         }
      }
   }

   this.file.writeline("");
}

//////////////////////////////////////////
