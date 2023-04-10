// nicer print

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

