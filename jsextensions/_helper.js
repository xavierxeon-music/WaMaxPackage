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

function print() {

   for (var index = 0; index < arguments.length; index++)
      post(arguments[index]);
   post("\n");
}

function dump(obj, name) {

   if ((typeof obj == "number") || (typeof obj == "string")) {
      print(name + " :" + obj);
   }
   else {
      for (var k in obj) {
         if (obj[k] && typeof obj[k] == "object") {
            objectprinter(obj[k], name + "[" + k + "]");
         }
         else {
            print(name + "[" + k + "] : " + obj[k])
         }
      }
   }
}

