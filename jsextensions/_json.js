// json

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

function saveJsonFile(object, fileName) {

   // TODO: delete old file
   var file = new File(fileName, "write");

   var content = JSON.stringify(object);
   file.writestring(content);

   file.close();
}